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
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
};
