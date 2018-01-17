const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
require('dotenv').config()
const pkg = require('../package.json')
const configFile = path.join(process.cwd(), 'config.yml')

const BUILD = process.env.BUILD || 'development'
const BUILD_DEBUG = process.env.BUILD_DEBUG

if (BUILD_DEBUG) {
  process.env.DEBUG = 'metalsmith:*'
}

module.exports = () => {
  console.log('## DEBUG - configFile', configFile)
  const config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
  // Global Configuration
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

  let assetPath = config.assetPath[BUILD] || '/'
  if (BUILD === 'production') {
    if (config.assetPath.domain) {
      assetPath = `${config.assetPath.domain}/${objectsLocation}`
    } else if (!config.assetPath.production) {
      assetPath = `//s3-${awsConfig.region}.amazonaws.com/${awsConfig.bucketName}/${objectsLocation}`
    }
  }

  // new config props
  config.objectsLocation = objectsLocation
  config.assetPath = assetPath
  config.version = version
  config.dependencies = dependencies
  config.devBuild = devBuild
  config.debugMode = debugMode
  config.buildDate = buildDate
  config.repository = repository.url

  return config
}
