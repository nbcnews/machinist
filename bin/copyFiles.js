const path = require('path')
const gulp = require('gulp')

module.exports.assets = () => {
  const assetsSrc = path.join(__dirname, '../assets/**')
  console.log('Copied: ', assetsSrc, 'to: assets/')
  gulp.src(assetsSrc).pipe(gulp.dest('assets'))
}

module.exports.mainFolders = () => {
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

module.exports.mainFiles = () => {
  const files = [
    'webpack.cli-config.js', '.env.example', '.editorconfig', '.eslintrc', '.nvmrc',
    '.stylelintrc', '.htmlhintrc', '.gitignore'
  ]
  gulp.src(files).pipe(gulp.dest('./'))
  console.log('Copied: ', files, 'to ./')
}
