module.exports = {
    lintOnSave: false,
    publicPath: process.env.VUE_BASE_URL || '/',
    productionSourceMap: false,
    pluginOptions: {
        electronBuilder: {
          preload: 'src/preload.js',
          externals: ['ssh2', 'tunnel-ssh'],
        }
    },
    transpileDependencies: [
        'resize-detector' // vue-echarts
    ]
}
