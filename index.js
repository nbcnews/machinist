require('dotenv').config()
// Set a true or false for production/development. Use to run certain plugins
const BUILD = process.env.BUILD
const BUILD_DEBUG = process.env.BUILD_DEBUG

if (BUILD_DEBUG) {
  process.env.DEBUG = 'metalsmith:*'
}

// Dependencies
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const Metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const layouts = require('metalsmith-layouts')
const assets = require('metalsmith-assets')
const collections = require('metalsmith-collections')
const permalinks = require('metalsmith-permalinks')
const browserSync = require('metalsmith-browser-sync')
const globaldata = require('metalsmith-metadata')
const sass = require('metalsmith-sass')
const inplace = require('metalsmith-in-place')
const debug = require('metalsmith-debug')
const helpers = require('metalsmith-register-helpers')
const postcss = require('metalsmith-with-postcss')
const paths = require('metalsmith-paths')
const drafts = require('metalsmith-drafts')
const webpack = require('metalsmith-webpack2')
const models = require('metalsmith-models')
const filedata = require('metalsmith-filedata')
const writemetadata = require('metalsmith-writemetadata')
const raw = require('metalsmith-raw')
const debugUi = require('metalsmith-debug-ui')
const fingerprint = require('metalsmith-fingerprint-ignore')
const pkg = require('./package.json')
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'))

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
const UTCDate = dateNow.toISOString()

let assetPath = config.assets[BUILD] || '/'
if (BUILD === 'production') {
  if (config.assets.domain) {
    assetPath = `${config.assets.domain}/${objectsLocation}`
  } else if (!config.assets.production) {
    assetPath = `//s3-${awsConfig.region}.amazonaws.com/${awsConfig.bucketName}/${objectsLocation}`
  }
}

config.assetPath = assetPath
config.version = pkg.version
config.dependencies = pkg.dependencies
config.repository = pkg.repository.url
config.devBuild = (BUILD === 'development')
config.debugMode = (BUILD_DEBUG)
config.dest = `./${config.dest}/`
config.src = `./${config.src}/`
config.buildDate = UTCDate

// Adds metadata from files
const data = {}
if (fs.existsSync(config.src + 'data/globals/')) {
  const dataFiles = fs.readdirSync(path.join(__dirname, `${config.src}data`, 'globals'))

  dataFiles.forEach(function (filename) {
    data[filename.split('.')[0]] = `data/globals/${filename}`
  })
}

let ms = Metalsmith(__dirname)

if (config.debugMode) {
  debugUi.patch(ms) // http://localhost:3000/debug-ui/index.html
}

// Metalsmith Build
ms.source(config.src)
  .destination(config.dest)
  .metadata(config)
  .use(globaldata(data))
  .use(models({
    directory: `${config.src}data/models`
  }))
if (config.collections) {
  ms.use(collections(config.collections))
}
ms.use(sass({
  outputStyle: config.devBuild ? 'expanded' : 'compressed',
  outputDir: 'styles',
  sourceMapContents: config.devBuild,
  sourceMapEmbed: config.devBuild
}))
  .use(postcss({
    pattern: ['**/*.css', '!**/_*/*', '!**/_*'],
    from: '*.scss',
    to: '*.css',
    map: config.devBuild ? {inline: true} : false,
    plugins: {
      'autoprefixer': {browsers: ['> 0.5%', 'Explorer >= 10']}
    }
  }))
  .use(filedata({
    pattern: ['styles/*.css']
  }))
  .use(webpack(require('./webpack.config.js')(config)))
  .use(fingerprint({
    pattern: 'styles/main.css',
    keep: true
  }))
  .use(helpers({
    directory: 'lib/helpers'
  }))
  .use(inplace({
    engine: 'handlebars',
    pattern: ['**/*.{html,xml,txt,md}', '!admin/*'],
    directory: config.src,
    partials: 'partials'
  }))
  .use(markdown({
    smartypants: true,
    gfm: true,
    tables: true,
    langPrefix: 'language-'
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: 'layouts',
    partials: 'partials',
    default: 'story.hbs',
    pattern: '**/*.html'
  }))
  .use(writemetadata({
    pattern: ['embed.html', 'styles/*.css'],
    ignorekeys: ['webpackStats'],
    bufferencoding: 'utf8'
  }))
  .use(drafts())
  .use(permalinks({
    relative: false,
    pattern: ':file',
    linksets: [{
      match: {collection: 'articles'},
      pattern: ':collection/:title'
    }, {
      match: {collection: 'work'},
      pattern: ':collection/:title'}
    ]
  }))
  .use(paths({
    property: 'paths',
    directoryIndex: 'index.html'
  }))
  .use(raw())
  .use(assets({
    source: './assets', // relative to the working directory
    destination: './assets' // relative to the build directory
  }))

if (config.devBuild) {
  ms.use(browserSync({
    server: config.dest,
    files: [`${config.src}**/*.*`, 'layouts/*.*', 'partials/**/*.*', './config.yml', 'assets/**/*.*'],
    open: false,
    notify: false,
    online: true
  }))
}

ms.use(debug({
  files: false,
  match: '**/*.md'
}))
.build(function (error) {
  console.log((config.devBuild ? 'Development' : 'Production'), 'build success, version', pkg.version)
  if (error) {
    console.log(error)
  }
})
