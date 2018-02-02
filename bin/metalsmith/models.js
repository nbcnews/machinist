const debug = require('debug')('metalsmith-models')
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
function getModel (path, metalsmith, done, callback) {
  readFile(path, metalsmith, done, (err, res) => {
    if (err) {
      throw Error(err + ' @ readFile()')
    }

    try {
      const content = JSON.parse(res ? res.contents.toString() : {})
      return callback(null, content)
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

// const path = require('path')
// const yaml = require('js-yaml')
// const aml = require('archieml')

// let fileCount = 0

// function readFile (path, metalsmith, done, callback) {
//   fileCount++
//   metalsmith.readFile(path, function (err, res) {
//     // console.log('models - readFile:', path)
//     --fileCount
//     callback(err, res)
//     if (fileCount === 0) { done() }
//   })
// }

// module.exports = function (opts) {
//   var dir = opts.directory || 'models'

//   return function (files, metalsmith, done) {
//     fileCount = 0
//     Object.keys(files).forEach(function (file) {
//       var filePath
//       // console.log('### model: stringifying file: %s', file)
//       var data = files[file]

//       if (typeof data.model === 'string') {
//         filePath = metalsmith.path(dir, data.model)
//         readFile(filePath, metalsmith, done, function (err, res) {
//           try {
//             if (path.extname(filePath) === '.json') {
//               data.model = JSON.parse(res ? res.contents : {})
//             } else if (path.extname(filePath) === '.yml') {
//               data.model = yaml.safeLoad(res ? res.contents : {})
//             } else if (path.extname(filePath) === '.aml') {
//               data.model = aml.load(res.contents.toString('utf8'))
//             }
//           } catch (e) {
//             throw new Error('Error loading data for file ' + file + '\n\n' + err)
//           }
//         })
//       } else if (typeof data.model === 'object') {
//         Object.keys(data.model).forEach(function (key) {
//           // console.log(key)
//           filePath = metalsmith.path(dir, data.model[key])
//           console.log('### forEach - file path:', filePath)
//           // console.log('### path.ext:', path.extname(filePath))
//           // console.log('### data model key:', data.model[key])

//           readFile(filePath, metalsmith, done, function (err, res) {
//             console.log('### readFile() - file path:', filePath)
//             try {
//               // data.model[key] = JSON.parse(res ? res.contents : {})
//               // console.log('### file path:', filePath)
//               // console.log('### path.ext:', path.extname(filePath))
//               // console.log('### data model key:', data.model[key])
//             } catch (e) {
//               throw new Error('Error loading data for file ' + file + '\n\n' + err)
//             }
//           })
//         })
//       }
//     })
//   }
// }
