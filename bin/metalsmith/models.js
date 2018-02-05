const path = require('path')
const debug = require('debug')('metalsmith-models')
const yaml = require('js-yaml')
const aml = require('archieml')

let fileCount = 0

// TODO: wrap with a promise
function readFile (path, metalsmith, done, callback) {
  fileCount++
  metalsmith.readFile(path, function (err, res) {
    --fileCount
    callback(err, res)
    if (fileCount === 0) { done() }
  })
}

// TODO: wrap with a promise
function getModel (filePath, metalsmith, done, callback) {
  readFile(filePath, metalsmith, done, (err, res) => {
    if (err) {
      throw Error(err + ' @ readFile()')
    }

    try {
      if (path.extname(filePath) === '.json') {
        return callback(null, JSON.parse(res ? res.contents.toString() : {}))
      } else if (path.extname(filePath) === '.yml') {
        return callback(null, yaml.safeLoad(res ? res.contents : {}))
      } else if (path.extname(filePath) === '.aml') {
        return callback(null, aml.load(res.contents.toString('utf8')))
      }
    } catch (ex) {
      callback(ex)
    }
  })
}

module.exports = function (opts) {
  var dir = opts.directory || 'models'

  return function (files, metalsmith, done) {
    fileCount = 0
    Object.keys(files).forEach(file => {
      const data = files[file]
      debug(data.model)
      if (typeof data.model === 'string') {
        const filePath = metalsmith.path(dir, data.model)
        debug('1 Model filePath:', filePath)
        getModel(filePath, metalsmith, done, function (err, content) {
          if (err) { throw Error(err) }
          data.model = content
        })
      } else if (typeof data.model === 'object') {
        Object.keys(data.model).forEach(key => {
          const filePath = metalsmith.path(dir, data.model[key])
          debug('Multi-Model filePath:', filePath)
          getModel(filePath, metalsmith, done, (err, content) => {
            if (err) { throw Error(err) }
            data.model[key] = content
          })
        })
      }
    })
  }
}
