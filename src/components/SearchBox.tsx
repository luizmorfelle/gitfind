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
}: {
  onSelect: (user: GitHubUser) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GitHubUserSearch[]>([]);
  const [loading, setLoading] = useState(false);

  const searchSelectUser = async (username: string) => {
    const octokit = getOctokit();
    const response = await octokit.request("GET /users/{username}", {
      username,
    });
    const user = response.data as GitHubUser;
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

      setLoading(true);
      const octokit = getOctokit();
      const response = await octokit.request("GET /search/users", {
        q: `${query} in:login`,
        per_page: 10,
      });
      const data = response.data.items as GitHubUserSearch[];
      setResults(data);
      setCache(cacheKey, data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="w-full">
      <div className="">
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
        className="h-full overflow-y-auto overflow-x-hidden"
        style={{ background: COLORS.bg, marginTop: 8 }}
        elevation={0}
      >
        {loading ? (
          <div className="space-y-2 p-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton width="50%" />
                  <Skeleton width="30%" />
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </Paper>
    </div>
  );
}
