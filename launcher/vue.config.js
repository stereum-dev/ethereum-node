module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      externals: ['ssh2', 'tunnel-ssh']
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
