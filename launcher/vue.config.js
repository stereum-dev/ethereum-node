module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      externals: ['ssh2', 'tunnel-ssh'],
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        buildDependenciesFromSource: false,
        nodeGypRebuild: false,
        npmRebuild: false,
        //npmArgs: "--no-optional",
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
