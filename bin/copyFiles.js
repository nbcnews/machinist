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
    'webpack.config.js',
    '.gitignore', // NOTE: won't copy bc npm removes .gitignore files
    '.env.example',
    '.editorconfig',
    '.eslintrc',
    '.eslintignore',
    '.nvmrc',
    '.stylelintrc',
    '.htmlhintrc'
  ]
  files.forEach(file => {
    const src = path.join(__dirname, `../${file}`)
    console.log('Copied: ', src, `to: ${file}`)
    gulp.src(src).pipe(gulp.dest('.'))
  })
}
