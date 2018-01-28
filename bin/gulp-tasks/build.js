const gulp = require('gulp')
const md5 = require('gulp-md5-plus')
const inlineImagePath = require('gulp-rewrite-image-path')
const jsoncombine = require('gulp-jsoncombine')

// Adds unique hash to image files and updates the src paths with the new image names. i.e. Cache busting
function md5Assets () {
  gulp.src('./assets/*.{jpg,png,gif,svg}')
    .pipe(md5(10, '.tmp/assets/*.html'))
    .pipe(gulp.dest('.tmp/assets'))
}

// Copies the hashed elements from assets to a temporary folder to then later be used by other Gulp Tasks
function copyAssets () {
  gulp.src('.tmp/assets/**')
    .pipe(gulp.dest('./www/assets/'))
}

// Runs on production builds, not development builds. Rewrites the assets paths for being hosted
function rewriteAssetPath (config) {
  return function () {
    gulp.src('./assets/*.html')
      .pipe(inlineImagePath({
        path: `${config.assetPath}`
      }))
      .pipe(gulp.dest('.tmp/assets'))
  }
}

// Takes resulting metadata JSON from build and combines to make a single JSON file that contains markup, styles and model
function combineJson (config) {
  return function () {
    gulp.src([
      `${config.dest}/embed.json`,
      `${config.dest}/styles/main.json`
    ])
    .pipe(jsoncombine('remoteData.json', (data) => Buffer.from(JSON.stringify({config, embed: data.embed, styles: data.main}))))
    .pipe(gulp.dest(config.dest))
  }
}

module.exports = {
  combineJson,
  rewriteAssetPath,
  copyAssets,
  md5Assets
}
