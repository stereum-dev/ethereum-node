module.exports = {
  pluginOptions: {
    electronBuilder: {      
      preload: 'src/preload.js',
      externals: ['ssh2', 'tunnel-ssh'],
      builderOptions: {
        appId: "com.stereum.launcher",
        productName: "Stereum Launcher",
        afterSign: "@sapien99/vue-cli-plugin-electron-builder-notarize",  
        // options placed here will be merged with default configuration and passed to electron-builder
        buildDependenciesFromSource: false,
        nodeGypRebuild: false,
        npmRebuild: false,
	linux: {
	  target: "AppImage"
	},
        mac: {
	  hardenedRuntime  : true,
          entitlements: "./node_modules/@sapien99/vue-cli-plugin-electron-builder-notarize/entitlements.mac.inherit.plist",
          gatekeeperAssess: false
	}        
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader', 'css-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2
            }
          }
        }
      })
  }
}
