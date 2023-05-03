// eslint-disable-next-line no-unused-vars
const path = require("path");
module.exports = {
  parallel: false,
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js",
      externals: ["ssh2"],
      builderOptions: {
        appId: "com.stereum.launcher",
        productName: "Stereum Launcher",
        afterSign: "@sapien99/vue-cli-plugin-electron-builder-notarize",
        // options placed here will be merged with default configuration and passed to electron-builder
        buildDependenciesFromSource: false,
        nodeGypRebuild: false,
        npmRebuild: false,
        linux: {
          target: "AppImage",
        },
        mac: {
          hardenedRuntime: true,
          entitlements:
            "./node_modules/@sapien99/vue-cli-plugin-electron-builder-notarize/entitlements.mac.inherit.plist",
          gatekeeperAssess: false,
        },
        win: {
          //certificateSubjectName: "put thumbprint here"
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("vue-i18n", "vue-i18n/dist/vue-i18n.cjs.js");

    config.module.rule("vue").use("vue-loader", "css-loader");
  },
};
