const shouldNotarize = process.env.NOTARIZE === "true";
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
        ...(shouldNotarize ? { afterSign: "@sapien99/vue-cli-plugin-electron-builder-notarize" } : {}),
        buildDependenciesFromSource: false,
        nodeGypRebuild: false,
        npmRebuild: false,
        // Define protocols once here at the root level
        protocols: [
          {
            name: "Stereum Launcher Protocol",
            schemes: ["stereumlauncher"],
          },
        ],
        linux: {
          target: ["AppImage", "deb"],
          artifactName: "Stereum-Launcher-${version}.${ext}",
        },
        mac: {
          hardenedRuntime: true,
          entitlements: "./node_modules/@sapien99/vue-cli-plugin-electron-builder-notarize/entitlements.mac.inherit.plist",
          gatekeeperAssess: false,
          artifactName: "Stereum-Launcher-${version}.${ext}",
        },
        win: {
          sign: "./customsign.js", //change to windows-signing.js
          artifactName: "Stereum-Launcher-Setup-${version}.${ext}",
        },
      },
    },
  },

  chainWebpack: (config) => {
    config.resolve.alias.set("vue-i18n", "vue-i18n/dist/vue-i18n.cjs.js");
    config.module.rule("vue").use("vue-loader").loader("vue-loader");
    config.plugin("define").tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: "true",
        __VUE_PROD_DEVTOOLS__: "false",
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
      });
      return definitions;
    });
  },
};
