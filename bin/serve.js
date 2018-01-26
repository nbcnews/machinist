const browserSync = require('metalsmith-browser-sync')

module.exports = (ms, config) => {
  ms.use(browserSync({
    server: config.dest,
    files: [`${config.src}/**/*.*`, 'layouts/*.*', 'partials/**/*.*', './config.yml', 'assets/**/*.*'],
    open: false,
    notify: false,
    online: true
  }))
}
