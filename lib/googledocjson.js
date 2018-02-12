require('dotenv').config({silent: true})

const myConfig = {
  'client_id': process.env.GOOGLE_CLIENT_ID,
  'client_secret': process.env.GOOGLE_CLIENT_SECRET,
  'oAuthTokens': {'refresh_token': process.env.GOOGLE_REFRESH_TOKEN}
}

const GoogleDocToJSON = require('googledoc-to-json')
const gDocToJSON = new GoogleDocToJSON(myConfig)
const fs = require('fs')
const yaml = require('js-yaml')
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'))
const log = require('log-utils')

const options = {
  fileId: config.googleDocJson.fileId,
  oAuthTokens: myConfig.oAuthTokens,
  output: config.googleDocJson.output
}

gDocToJSON.getArchieML(options, function (err, aml) {
  if (err) {
    // eslint-disable-next-line
    console.log(log.error + ' Google Doc to JSON ' + err)
    return
  }
  fs.writeFileSync(options.output, JSON.stringify(aml, null, '\t'))
  log.ok('Google Doc Success: ' + options.fileId + ' written to ' + options.output)
})
