import tseslint from "typescript-eslint";

export default [
  {files: ["**/*.{ts,tsx}"]},
  ...tseslint.configs.recommended,
  {
    ignores: ['metro.config.js'],
  }
];