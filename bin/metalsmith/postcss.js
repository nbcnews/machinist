const path = require('path')
const minimatch = require('minimatch')
const postcss = require('postcss')

module.exports = exports = function (options) {
  var defaults = {
    pattern: ['**/*.css', '!**/_*/*', '!**/_*'],
    parser: undefined,
    stringifier: undefined,
    syntax: undefined,
    plugins: {},
    map: {inline: true},
    removeExcluded: false
  }
  options = options ? Object.assign(defaults, options) : defaults
  options.pattern = Array.isArray(options.pattern) ? options.pattern : [options.pattern]
  var plugin = null
  var plugins = []
  var pluginKeys = Object.keys(options.plugins)

  if (typeof options.plugins === 'object' && pluginKeys.length) {
    for (var i = 0, name; name = pluginKeys[i++];) { // eslint-disable-line no-cond-assign
      var args = options.plugins[name]
      // console.log(name, args);
      plugin = require(name)
      plugins.push(plugin(args))
    }
  } else { throw new Error('[metalsmith-with-postcss] You must provide some PostCSS plugins.') }

  var processor = postcss(plugins)

  return function metalsmithPostcss (files, metalsmith, done) {
    var allKeys = Object.keys(files)
    var actKeys = []
    var remKeys = []
    var keys = null
    var promises = []

    for (var i = 0, pat; pat = options.pattern[i++];) { // eslint-disable-line no-cond-assign
      if (pat[0] !== '!') {
        keys = allKeys.filter(minimatch.filter(pat, { matchBase: true }))
        actKeys = actKeys.concat(keys)
        remKeys = remKeys.length ? remKeys.filter(minimatch.filter('!' + pat, { matchBase: true })) : remKeys
        // remKeys = remKeys.concat(keys);
      } else if (actKeys.length) {
        actKeys = actKeys.filter(minimatch.filter(pat, { matchBase: true }))
        keys = allKeys.filter(minimatch.filter(pat.slice(1), { matchBase: true }))
        remKeys = remKeys.concat(keys)
      }
    }

    for (var j = 0, key; key = actKeys[j++];) { // eslint-disable-line no-cond-assign
      var file = files[key]
      var css = file.contents.toString()

      var promise = processor.process(css, {
        from: path.join(metalsmith._source, key),
        to: path.join(metalsmith._destination, key),
        parser: options.parser,
        stringifier: options.stringifier,
        syntax: options.syntax,
        map: options.map
      })
      .then(function (file, result) {
        // console.log(file, '\n-------------------------------------------');
        file.contents = Buffer.from(result.css)
      }.bind(null, file))

      promises.push(promise)
    }

    Promise.all(promises)
      .then(function (results) {
        if (options.removeExcluded) {
          for (var i = 0, key; key = remKeys[i++];) { // eslint-disable-line no-cond-assign
            delete files[key]
          }
        }
        // console.log(actKeys, remKeys, Object.keys(files));
        done()
      })
      .catch(function (err) {
        done(new Error('[metalsmith-with-postcss] Error during postcss processing: ' + JSON.stringify(err)))
      })
  }
}
