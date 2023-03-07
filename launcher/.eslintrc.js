module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: ["plugin:vue/recommended", "eslint:recommended", "prettier"],
  rules: {
    "no-prototype-builtins": "off",
    "vue/no-mutating-props": "off",
    "vue/no-v-for-template-key": "off",
    "no-empty": ["error", { allowEmptyCatch: true }],
  },
};
