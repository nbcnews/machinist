const fs = require('fs')
const glob = require('glob')

function secureCheck (files) {
  const warnings = []
  files.forEach(function (file) {
    if (file.indexOf('node_modules') > -1) {
      return
    }
    const content = fs.readFileSync(file, 'utf-8')
    const lines = content.split(/\r?\n/g)

    lines.forEach(function (line, i) {
      var matches = line.match(/\w{3}(=|\()("|')http:\/\/[^\s'"]+/ig) || []
      matches.forEach(function (match) {
        match = { url: match, file, line: i + 1 }
        if (match.url.match(/src=|url\(/ig)) {
          console.log(`${match.file}:${match.line} -- ${match.url}`) // eslint-disable-line
          warnings.push(match)
        }
      })
    })
  })
  return warnings
}

const files = glob.sync('{,!(node_modules)/**/}*.{js,css,scss,hbs,html}')
console.log(files.length, 'files checked for insecure assets!') // eslint-disable-line
const warnings = secureCheck(files)
if (warnings.length) {
  throw Error('secure-check failed on:' + JSON.stringify(warnings))
}
