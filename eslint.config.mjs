import next from "eslint-config-next";

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**"] },
  ...next,
  {
    rules: {
      // ponytail: the React Compiler rule flags our URL-sync and fetch-reset
      // effects, which are deliberate. Warn, not error; promote back to "error"
      // if these components are ever rewritten around useSyncExternalStore.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
