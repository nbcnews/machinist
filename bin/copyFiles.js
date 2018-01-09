const gulp = require('gulp')

module.exports.assets = () => {
  const assetsSrc = `${__dirname}/../assets/**`
  console.log('DEBUG: ', assetsSrc)
  gulp.src(assetsSrc).pipe(gulp.dest('../assets'))
}
