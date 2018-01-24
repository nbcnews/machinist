const path = require('path')
const webpack = require('webpack')

module.exports = plugin

function plugin (options) {
  return function (files, metalsmith, done) {
    var webpackOptions
    if (typeof options === 'string') {
      var configPath = path.resolve(path.dirname(require.main.filename), options)
      webpackOptions = require(configPath)
    } else {
      webpackOptions = options
    }
    if (webpackOptions) {
      webpack(webpackOptions, function (err, stats) {
        var info = stats.toString({ chunkModules: false, colors: true })
        if (err || stats.hasErrors()) {
          console.error(err)
        }
        console.log(info)

        for (var file in files) {
          files[file].webpackStats = stats
        };

        done()
      })
    } else {
      console.warn('Warning: No webpack configuration provided.')
    }
  }
}
