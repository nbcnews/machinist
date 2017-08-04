const path = require('path')
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin.js')

module.exports = function (config) {
  return {
    context: path.resolve(__dirname, config.src + 'scripts/'),
    entry: {
      main: './main.js'
    },
    devtool: config.devBuild ? 'cheap-module-eval-source-map' : false,
    output: {
      path: path.resolve(__dirname, config.dest + 'scripts/'),
      filename: config.devBuild ? '[name].bundle.js' : '[name].[hash].bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-0']
            }
          }
          ]
        },
        {
          test: /\.coffee$/,
          use: [ 'coffee-loader' ]
        }
      ]
    },
    plugins: [
      new UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      })
    ]
  }
}
