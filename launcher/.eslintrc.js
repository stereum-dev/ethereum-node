module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: ["plugin:vue/recommended", "eslint:recommended", "prettier"],
  rules: {
    "vue/require-default-prop": "off",
    "vue/valid-v-bind": "off",
    "no-prototype-builtins": "off",
    "vue/no-mutating-props": "off",
    "vue/no-v-for-template-key": "off",
    "no-empty": ["error", { allowEmptyCatch: true }],
  },
};
