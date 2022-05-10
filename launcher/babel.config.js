module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        polyfills: [
          'es.promise',
          'es.symbol',
          'es.object.entries',
          'es.array.includes'
        ]
      }
    ]
  ]
}
