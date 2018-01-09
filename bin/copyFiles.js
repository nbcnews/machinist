const path = require('path')
const gulp = require('gulp')

module.exports.assets = () => {
  const assetsSrc = path.join(__dirname, '../assets/**')
  console.log('Copied: ', assetsSrc, 'to: assets/')
  gulp.src(assetsSrc).pipe(gulp.dest('assets'))
}

module.exports.core = () => {
  const folders = [
    'layouts',
    'lib',
    'partials',
    'src'
  ]

  folders.forEach((folder) => {
    const src = path.join(__dirname, `../${folder}/**`)
    console.log('Copied: ', src, `to: ${folder}/`)
    gulp.src(src).pipe(gulp.dest(folder))
  })
}
