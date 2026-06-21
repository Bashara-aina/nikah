import next from "eslint-config-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "public/**", "scripts/**", "*.config.mjs"],
  },
  {
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "react-hooks/exhaustive-deps": "error",
      "prefer-const": "error",
    },
  },
];