// const path = require("path");

module.exports = {
  parallel: false,
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js",
      externals: ["ssh2"],
      builderOptions: {
        directories: {
          output: "dist/${platform}",
        },
        appId: "com.stereum.launcher",
        productName: "Stereum-Launcher",
        afterSign: "@sapien99/vue-cli-plugin-electron-builder-notarize",
        // options placed here will be merged with default configuration and passed to electron-builder
        buildDependenciesFromSource: false,
        nodeGypRebuild: false,
        npmRebuild: false,
        linux: {
          target: "AppImage",
          artifactName: "Stereum-Launcher-${version}.${ext}",
        },
        mac: {
          hardenedRuntime: true,
          entitlements:
            "./node_modules/@sapien99/vue-cli-plugin-electron-builder-notarize/entitlements.mac.inherit.plist",
          gatekeeperAssess: false,
          artifactName: "Stereum-Launcher-${version}.${ext}",
        },
        win: {
          sign: "./customsign.js", // use custom sign hook on windows
          artifactName: "Stereum-Launcher-Setup-${version}.${ext}",
        },
      },
    },
  },

  chainWebpack: (config) => {
    config.resolve.alias.set("vue-i18n", "vue-i18n/dist/vue-i18n.cjs.js");
    config.module.rule("vue").use("vue-loader", "css-loader");
  },
};
