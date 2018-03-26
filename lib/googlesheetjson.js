require('dotenv').config({silent: true})

const myConfig = {
  'client_id': process.env.GOOGLE_CLIENT_ID,
  'client_secret': process.env.GOOGLE_CLIENT_SECRET,
  'oAuthTokens': {'refresh_token': process.env.GOOGLE_REFRESH_TOKEN},
  'redirect_urls': ['http://localhost']
}

const GoogleSheetToJSON = require('googlesheet-to-json')
const gSheetToJSON = new GoogleSheetToJSON(myConfig)
const fs = require('fs')
const yaml = require('js-yaml')
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'))
const log = require('log-utils')

const options = {
  spreadsheetId: config.googleSheetJson.sheetId,
  range: config.googleSheetJson.range,
  oAuthTokens: myConfig.oAuthTokens,
  output: config.googleSheetJson.output
}

gSheetToJSON.getRows(options)
  .then((rows) => {
    fs.writeFileSync(options.output, JSON.stringify(rows, null, '\t'))
    log.ok(`Google Sheet Success: ${options.spreadsheetId} written to ${options.output}`)
  })
  .catch(reason => {
    console.error(`${log.error} Google Sheet to JSON ${reason}`)
  })
