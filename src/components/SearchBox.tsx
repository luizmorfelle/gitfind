"use client";
import { useEffect, useState } from "react";
import { getCache, setCache } from "../lib/cache";
import { getOctokit } from "../lib/github";
import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  TextField,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "../lib/colors";
import { GitHubUser } from "../models/githubUser";
import { GitHubUserSearch } from "../models/githubUserSearch";

export default function SearchBox({
  onSelect,
  onLoadingChange,
}: {
  onSelect: (user: GitHubUser) => void;
  onLoadingChange: (loading: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GitHubUserSearch[]>([]);

  const searchSelectUser = async (username: string) => {
    const octokit = getOctokit();
    const response = await octokit.request("GET /users/{username}", {
      username,
    });
    const user = response.data as GitHubUser;
    setResults([]);
    setQuery("");
    onSelect(user);
  };

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      const cacheKey = `search:${query}`;
      const cached = getCache(cacheKey);
      if (cached) return setResults(cached);

      onLoadingChange(true);
      const octokit = getOctokit();
      const response = await octokit.request("GET /search/users", {
        q: `${query} in:login`,
        per_page: 10,
      });
      const data = response.data.items as GitHubUserSearch[];
      setResults(data);
      setCache(cacheKey, data);
      onLoadingChange(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="">
      <div className="sm:relative absolute w-full p-4">
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar usuário (min 3 caracteres)"
          variant="filled"
          size="small"
          fullWidth
          slotProps={{
            input: {
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ color: COLORS.primary }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setQuery("")}>
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ color: COLORS.primary }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {},
          }}
        />
      </div>

      <Paper
        className=" sm:h-full overflow-y-auto overflow-x-hidden sm:relative absolute sm:top-0 top-16 px-4 w-full"
        style={{ background: COLORS.bg }}
        elevation={0}
      >
        <List>
          {results.map((u) => (
            <ListItem
              key={u.id}
              onClick={() => searchSelectUser(u.login ?? "")}
              className="hover:bg-zinc-700 bg-[#2E3240] rounded-lg m-1 text-white font-bold"
              style={{ cursor: "pointer" }}
            >
              <ListItemAvatar>
                <Avatar src={u.avatar_url ?? ""} alt={u.login ?? ""} />
              </ListItemAvatar>
              <ListItemText
                primary={u.login}
                secondary={u.html_url}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: COLORS.text,
                    fontWeight: 600,
                  },
                  "& .MuiListItemText-secondary": {
                    color: COLORS.text,
                    fontSize: "0.85rem",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
}
