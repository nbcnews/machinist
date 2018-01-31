const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const debug = require('debug')('machinist:register-partials')

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file))
  })
  return filelist
}

module.exports = function (options) {
  options.directory = options.directory || 'partials'
  options.ext = options.ext || '.hbs'

  function registerPartials (filelist, done) {
    filelist.forEach((filename, idx) => {
      const partialName = path.relative(options.directory, filename).replace(`${options.ext}`, '')
      const baseFileName = path.basename(filename)
      const hasExt = (baseFileName.indexOf(options.ext) > -1)
      if (!hasExt) {
        debug(`No ${options.ext} extension in ${baseFileName}`)
        return
      }
      const template = fs.readFileSync(filename, 'utf8')
      Handlebars.registerPartial(partialName, template)
      debug(`Registered ${partialName} @ ${filename}`)
    })
    debug(`Done with registering ${filelist.length} partials`)
    done()
  }

  return function (files, metalsmith, done) {
    const dir = metalsmith.path(options.directory)
    const filelist = walkSync(dir)
    if (filelist.length > 0) {
      registerPartials(filelist, done)
    }
  }
}
