module.exports = {
    presets: [
        ['@vue/cli-plugin-babel/preset', {
            polyfills: [
                'es.promise',
                'es.symbol',
                'es.object.entries', // vue2-google-map
                'es.array.includes'  // vuebootstrap table
            ]
        }]
    ]
}