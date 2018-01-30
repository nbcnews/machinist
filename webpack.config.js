const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function (config) {
  return {
    context: path.resolve(__dirname, `${config.src}/scripts`),
    entry: {
      main: './main.js',
      dataviz: './dataviz.js'
    },
    devtool: config.devBuild ? 'eval-source-map' : false,
    output: {
      path: path.resolve(__dirname, `${config.dest}/scripts`),
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
              presets: ['@babel/preset-env']
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
        sourceMap: true
      })
    ]
  }
}
