module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        minifyFontValues: true,
        minifyGradients: true,
        mergeRules: true,
        calc: true,
        colormin: true,
        convertValues: true,
        discardDuplicates: true,
        discardEmpty: true,
        mergeIdents: true,
        mergeLonghand: true,
        minifyParams: true,
        minifySelectors: true,
        normalizeCharset: true,
        normalizeDisplayValues: true,
        normalizePositions: true,
        normalizeRepeatStyle: true,
        normalizeString: true,
        normalizeTimingFunctions: true,
        normalizeUnicode: true,
        normalizeUrl: true,
        orderedValues: true,
        reduceInitial: true,
        reduceTransforms: true,
        uniqueSelectors: true
      }]
    })
  ]
}; 