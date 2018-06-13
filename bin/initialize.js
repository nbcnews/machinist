const fs = require('fs')
const hbs = require('handlebars')
const copy = require('./copyFiles')
const exists = fs.existsSync

const templatePath = `${__dirname}/templates/`
var outputFiles = [
  '.gitignore',
  'package.json',
  'config.yml',
  'README.md'
]

function projectInit (program) {
  const projectName = program.init
  let month = program.args[1] || new Date().getMonth() + 1

  if (month.toString().length === 1) {
    month = '0' + month
  }

  const year = program.args[2] || new Date().getYear() + 1900
  const data = { projectName, month, year }

  console.log('## DEBUG data:', data)

  /** Modify files */

  function compileTemplate (data, source) {
    const template = hbs.compile(source)
    return template(data)
  }

  outputFiles.forEach(function (file) {
    const srcFile = `${templatePath}${file}.hbs`
    if (exists(srcFile)) {
      console.log('found:', srcFile)
      const fileText = fs.readFileSync(srcFile, 'utf8')
      const compiled = compileTemplate(data, fileText)
      fs.writeFileSync(file, compiled)
      console.log(file, '...generated')
    } else {
      console.log(`template: ${srcFile} not found`)
      console.log('TODO: copy to root')
    }
  })

  // copy core files
  copy.mainFolders()
  copy.mainFiles()

  // copy other files
  copy.assets()
}

module.exports.project = projectInit
