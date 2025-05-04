// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

// Resolve __dirname in ES modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a FlatCompat instance so we can extend shareable configs.
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // 1. Ignore directories (these work like .eslintignore)
  {
    ignores: ["**/node_modules/**", ".next", "out"],
  },

  // 2. Extend Next.js recommended configs: core-web-vitals and TypeScript.
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 3. Global settings and additional rules.
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    env: {
      browser: true,
      es2021: true,
    },
    plugins: {
      "react-hooks": {},
      prettier: {},
    },
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "react/no-unescaped-entities": "off",
      "no-debugger": "off",
      "react/react-in-jsx-scope": "off",
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: false,
          printWidth: 80,
          tabWidth: 2,
          trailingComma: "es5",
          endOfLine: "auto",
          bracketSpacing: true,
          jsxBracketSameLine: false,
        },
      ],
    },
  },

  // 4. TypeScript-specific configuration for .ts/.tsx files.
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      // Optionally, you can add parserOptions: { project: "./tsconfig.json" } if needed.
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },

  // 5. Extend Prettier recommended configuration to disable conflicting rules.
  ...compat.extends("plugin:prettier/recommended"),
  {
    // Optional overrides: reiterate rules you want to enforce.
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];
