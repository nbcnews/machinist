const fs = require('fs')
const path = require('path')
const Metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const layouts = require('metalsmith-layouts')
const assets = require('metalsmith-assets')
const collections = require('./metalsmith/collections')
const permalinks = require('metalsmith-permalinks')
const globaldata = require('metalsmith-metadata')
const sass = require('./metalsmith/sass')
const inplace = require('metalsmith-in-place')
const debug = require('metalsmith-debug')
const helpers = require('metalsmith-register-helpers')
const postcss = require('./metalsmith/postcss')
const paths = require('metalsmith-paths')
const drafts = require('metalsmith-drafts')
const webpack = require('./metalsmith/webpack')
const models = require('./metalsmith/models')
const filedata = require('metalsmith-filedata')
const writemetadata = require('metalsmith-writemetadata')
const raw = require('metalsmith-raw')
const debugUi = require('metalsmith-debug-ui')
const fingerprint = require('metalsmith-fingerprint-ignore')
const cwd = process.cwd()
const webpackConfig = require(path.join(cwd, 'webpack.config.js'))
const buildTasks = require('./gulp-tasks/build')
const tasks = require('./tasks')
const serve = require('./serve')

module.exports = (config) => {
  // gulp rewriteAssetPath
  tasks.rewriteAssetPath(config)()
  // && gulp md5Assets
  buildTasks.md5Assets()

  function postBuild () {
    // && gulp copyAssets
    buildTasks.copyAssets()

    // && gulp combineJson
    buildTasks.combineJson(config)()

    // TODO: npm run secure-check
  }

  // Adds metadata from files
  const data = {}
  const globalsDir = path.join(cwd, 'src/data/globals/')
  if (fs.existsSync(globalsDir)) {
    const dataFiles = fs.readdirSync(globalsDir)
    dataFiles.forEach(function (filename) {
      data[filename.split('.')[0]] = `data/globals/${filename}`
    })
  }

  const ms = Metalsmith(cwd) // move to root

  if (config.debugMode) {
    debugUi.patch(ms) // http://localhost:3000/debug-ui/index.html
  }

  if (config.devBuild) {
    serve(ms, config) // start browserSync
  }

  // Metalsmith Build
  ms.source(config.src)
    .destination(config.dest)
    .metadata(config)
    .use(globaldata(data))
    .use(models({
      directory: `${config.src}/data/models`
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
  .use(webpack(webpackConfig(config)))
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
  .use(debug({
    files: false,
    match: '**/*.md'
  }))
  .build(function (error) {
    if (error) {
      console.log(error)
      return
    }
    console.log((config.devBuild ? 'Development' : 'Production'), 'build success, version', config.version)
    postBuild()
  })
}
