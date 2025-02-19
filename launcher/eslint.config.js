// eslint.config.js
const vue = require("eslint-plugin-vue");
const prettier = require("eslint-plugin-prettier");
const globals = require("globals");
const allConfigs = require("eslint-plugin-prettier").configs;
const vueConfigs = require("eslint-plugin-vue").configs;
const eslintConfigs = require("@eslint/js").configs;

module.exports = [
  {
    files: ["src/**/*.{js,vue}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
        AudioWorkletGlobalScope: globals.browser["AudioWorkletGlobalScope"],
      },
      parser: require("vue-eslint-parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue,
      prettier,
    },
    rules: {
      ...eslintConfigs.recommended.rules,
      ...vueConfigs.recommended.rules,
      ...allConfigs.recommended.rules,
      "vue/require-default-prop": "off",
      "vue/valid-v-bind": "off",
      "no-prototype-builtins": "off",
      "vue/no-mutating-props": "off",
      "vue/no-v-for-template-key": "off",
      "no-empty": ["error", { allowEmptyCatch: true }], //empty catch block
      "no-unused-vars": ["error", { caughtErrors: "none" }], //unused variables in catch block
    },
    settings: {
      "prettier/prettier": "error",
    },
  },
];
