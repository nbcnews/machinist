require('dotenv').config({silent: true})

const fs = require('fs')
const paperToJSON = require('paper2json')
const log = require('log-utils')
const yaml = require('js-yaml')
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'))

const accessToken = process.env.DROPBOX_ACCESS_TOKEN
const fileId = config.dropboxPaperJson.fileId
const output = config.dropboxPaperJson.output

paperToJSON(fileId, accessToken)
.then((aml) => {
  fs.writeFileSync(output, JSON.stringify(aml, null, '\t'))
  return {fileId, output}
})
.then((file) => log.ok(`Dropbox Paper Success: ${file.fileId} written to ${file.output}`))
.catch(err => console.log(`${log.error} Dropbox Paper to JSON ${err.error}`))
