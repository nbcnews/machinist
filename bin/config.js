const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
const debug = require('debug')('machinist:config')
require('dotenv').config()
const pkg = require('../package.json')
const configFile = path.join(process.cwd(), 'config.yml')

const BUILD = process.env.BUILD || 'development'

module.exports = () => {
  debug('configFile', configFile)
  const config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))

  const awsConfig = {
    bucketName: process.env.BUCKET_NAME,
    region: process.env.AWS_DEFAULT_REGION
  }

  const yearString = config.projectInitDate.year
  const monthString = config.projectInitDate.month
  const configProjectNameProp = config.projectName
  const convertedProjectName = configProjectNameProp.replace(/\s+/g, '-').toLowerCase()
  const objectsLocation = `machinist/dist/${yearString}/${monthString}/${convertedProjectName}/`
  const dateNow = new Date()
  const buildDate = dateNow.toISOString()
  const devBuild = (BUILD === 'development')
  const debugMode = (process.env.BUILD_DEBUG)
  const { version, dependencies, repository } = pkg

  // determine assetPath
  let assetPath = config.assets[BUILD] || '/'
  if (BUILD === 'production') {
    if (config.assets.domain) {
      assetPath = `${config.assets.domain}/${objectsLocation}`
    } else if (!config.assets.production) {
      assetPath = `//s3-${awsConfig.region}.amazonaws.com/${awsConfig.bucketName}/${objectsLocation}`
    }

    // local prod assetPaths
    // TODO: replace logic with a localAssets option
    if (!config.assets.domain && config.assets.production === '/') {
      assetPath = ''
    }
  }

  // computed props for { config }
  config.assetPath = assetPath
  config.objectsLocation = objectsLocation
  config.projectSlug = convertedProjectName
  config.version = version
  config.dependencies = dependencies
  config.devBuild = devBuild
  config.debugMode = debugMode
  config.buildDate = buildDate
  config.repository = repository.url

  return config
}
