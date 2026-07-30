// electron-builder configuration (moved out of the former vue.config.js builderOptions).
// electron-vite produces the app bundle in out/; electron-builder packages it.
const shouldNotarize = process.env.NOTARIZE === "true";
const isSigned = process.env.CSC_IDENTITY_AUTO_DISCOVERY !== "false";

module.exports = {
  appId: "com.stereum.launcher",
  productName: "Stereum-Launcher",
  directories: {
    output: "dist/${platform}",
    buildResources: "build",
  },
  // Negation-only list: keep electron-builder's smart defaults (bundle out/ +
  // pruned production node_modules, auto-handle Electron); just drop the source
  // tree and root tooling config so they don't ship inside the asar.
  files: [
    "!src/**/*",
    "!public/**/*",
    "!coverage/**/*",
    "!dist_electron/**/*",
    "!.vscode/**/*",
    "!electron.vite.config.js",
    "!electron-builder.config.cjs",
    "!postcss.config.js",
    "!tailwind.config.js",
    "!vue.config.js",
    "!eslint.config.js",
    "!jest.config.js",
    "!babel.config.js",
  ],
  buildDependenciesFromSource: false,
  nodeGypRebuild: false,
  npmRebuild: false,
  // Notarize (release builds) via the @sapien99 afterSign hook; otherwise ad-hoc
  // re-sign unsigned macOS builds so macOS 26+ accepts the mismatched Team IDs.
  ...(shouldNotarize
    ? { afterSign: "@sapien99/vue-cli-plugin-electron-builder-notarize" }
    : !isSigned
      ? { afterSign: "./afterSignMac.js" }
      : {}),
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
    // hardenedRuntime requires consistent Team IDs across all binaries; only enable
    // when actually signing, otherwise the Electron Framework's pre-signed Team ID
    // differs from the unsigned main binary and dyld refuses to load it (macOS 14.4+)
    hardenedRuntime: isSigned,
    ...(isSigned
      ? {
          entitlements: "./node_modules/@sapien99/vue-cli-plugin-electron-builder-notarize/entitlements.mac.inherit.plist",
          entitlementsInherit: "./node_modules/@sapien99/vue-cli-plugin-electron-builder-notarize/entitlements.mac.inherit.plist",
        }
      : {}),
    gatekeeperAssess: false,
    artifactName: "Stereum-Launcher-${version}.${ext}",
    x64ArchFiles: "**/*.node",
  },
  win: {
    signtoolOptions: {
      sign: "./customsign.js",
    },
    artifactName: "Stereum-Launcher-Setup-${version}.${ext}",
  },
};
