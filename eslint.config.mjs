import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.node }},
  {
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error"
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];