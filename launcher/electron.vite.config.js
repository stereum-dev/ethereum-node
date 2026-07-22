import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";

// Electron main & preload run in Node/Electron: keep every runtime dependency
// (ssh2, web3, geoip-lite, evilscan, ping, electron-*, ...) external so it is
// resolved from node_modules at runtime instead of being bundled.
export default defineConfig({
  main: {
    // electron-store v11 is ESM-only; externalizing it as a CJS require lands the
    // constructor on `.default`. Bundle it instead so Vite handles the interop.
    plugins: [externalizeDepsPlugin({ exclude: ["electron-store"] })],
    resolve: {
      alias: { "@": resolve(__dirname, "src") },
    },
    build: {
      outDir: "out/main",
      rollupOptions: {
        input: { index: resolve(__dirname, "src/background.js") },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: { "@": resolve(__dirname, "src") },
    },
    build: {
      outDir: "out/preload",
      rollupOptions: {
        input: { index: resolve(__dirname, "src/preload.js") },
      },
    },
  },
  renderer: {
    root: ".",
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        // full build incl. the message compiler (matches the old vue.config alias)
        "vue-i18n": "vue-i18n/dist/vue-i18n.esm-bundler.js",
        // ControlService extends EventEmitter; bundle the browser-safe userland
        // package instead of letting Vite externalize the Node builtin.
        events: resolve(__dirname, "node_modules/events/events.js"),
      },
      // webpack resolved extensionless `.vue` imports; Vite omits `.vue` by
      // default, so add it to keep the existing import style working.
      extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    plugins: [vue()],
    define: {
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
      __VUE_I18N_FULL_INSTALL__: "true",
      __VUE_I18N_LEGACY_API__: "false",
      __INTLIFY_PROD_DEVTOOLS__: "false",
      // compile i18n messages without new Function() so a CSP without 'unsafe-eval' works
      __INTLIFY_JIT_COMPILATION__: "true",
    },
    server: {
      port: 8081,
    },
    build: {
      outDir: "out/renderer",
      rollupOptions: {
        input: { index: resolve(__dirname, "index.html") },
      },
    },
  },
});
