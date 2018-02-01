const path = require('path')
const yaml = require('js-yaml')
const aml = require('archieml')

let fileCount = 0

function readFile (path, metalsmith, done, callback) {
  fileCount++
  metalsmith.readFile(path, function (err, res) {
    // console.log('models - readFile:', path)
    --fileCount
    callback(err, res)
    if (fileCount === 0) { done() }
  })
}

module.exports = function (opts) {
  var dir = opts.directory || 'models'

  return function (files, metalsmith, done) {
    fileCount = 0
    Object.keys(files).forEach(function (file) {
      var filePath
      // console.log('### model: stringifying file: %s', file)
      var data = files[file]

      if (typeof data.model === 'string') {
        filePath = metalsmith.path(dir, data.model)
        readFile(filePath, metalsmith, done, function (err, res) {
          try {
            if (path.extname(filePath) === '.json') {
              data.model = JSON.parse(res ? res.contents : {})
            } else if (path.extname(filePath) === '.yml') {
              data.model = yaml.safeLoad(res ? res.contents : {})
            } else if (path.extname(filePath) === '.aml') {
              data.model = aml.load(res.contents.toString('utf8'))
            }
          } catch (e) {
            throw new Error('Error loading data for file ' + file + '\n\n' + err)
          }
        })
      } else if (typeof data.model === 'object') {
        Object.keys(data.model).forEach(function (key) {
          filePath = metalsmith.path(dir, data.model[key])

          readFile(filePath, metalsmith, done, function (err, res) {
            try {
              data.model[key] = JSON.parse(res ? res.contents : {})
            } catch (e) {
              throw new Error('Error loading data for file ' + file + '\n\n' + err)
            }
          })
        })
      }
    })
  }
}
