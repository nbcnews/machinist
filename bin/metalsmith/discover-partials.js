const Handlebars = require('handlebars')
const walk = require('fs-tools').walk
const fs = require('fs')
const path = require('path')

module.exports = function (options) {
  options.directory = options.directory || 'partials'
  options.pattern = options.pattern || /\.hbs$/

  const onFile = function (file, stats, next) {
    fs.readFile(file, 'utf8', function (err, contents) {
      if (err) {
        return next(err)
      }
      const relDir = path.relative(options.directory, file)
      const id = relDir.replace(/\.[^/.]+$/, '')
      Handlebars.registerPartial(id, contents)
      next()
    })
  }

  return function (files, metalsmith, done) {
    walk(metalsmith.path(options.directory), options.pattern, onFile, done)
  }
}
