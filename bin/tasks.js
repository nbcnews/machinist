const gulp = require('gulp')
const inlineImagePath = require('gulp-rewrite-image-path')

module.exports.rewriteAssetPath = (config) => {
  return function () {
    gulp.src('./assets/*.html')
      .pipe(inlineImagePath({
        path: `${config.assets.domain}/machinist/dist/${config.projectInitDate.year}/${config.projectInitDate.month}/${config.projectSlug}`
      }))
      .pipe(gulp.dest('.tmp/assets'))
  }
}
