module.exports = {
  // Jest Tests
  presets: ["@babel/preset-env"],
  plugins: [["@babel/plugin-transform-runtime", { helpers: true }]],
};
