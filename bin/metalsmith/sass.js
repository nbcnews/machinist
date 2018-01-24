const sass = require('node-sass')
const each = require('async/each')
const path = require('path')

// from https://gist.github.com/stevenschobert/ca76531b46f2ac00cbd8
const extend = function extend () {
  var args = [].slice.call(arguments)
  args[0] = (typeof args[0] === 'object') ? args[0] : {}

  for (var i = 1; i < args.length; i++) {
    if (typeof args[i] === 'object') {
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          args[0][key] = args[i][key]
        }
      }
    }
  }
  return args[0]
}

const isAnySassFile = function isAnySassFile (filename) {
  return (/^[^_.].*\.s[ac]ss/).test(path.basename(filename))
}

const isSassFile = function isSassFile (filename) {
  return (/^[^_.].*\.sass/).test(path.basename(filename))
}

const isPartial = function isPartial (filename) {
  return (/^_.*\.s[ac]ss/).test(path.basename(filename))
}

const compile = function (config, basePath, files, filename, done) {
  const file = files[filename]
  const filePath = path.join(basePath, filename)
  const opts = extend({
    includePaths: [],
    outputStyle: 'compressed',
    imagePath: '/',
    outputDir: path.dirname(filename),
    indentedSyntax: isSassFile(filename)
  }, config, {
            // Use the file's content stream buffer rather than the file path.
    data: file.contents.toString(),
    file: filePath
  })

  const fileDir = path.dirname(filePath)
  const computedOutputDir = (typeof opts.outputDir === 'function') ? opts.outputDir(path.dirname(filename)) : opts.outputDir
  const dest = path.join(computedOutputDir, path.basename(filename).replace(/\.s[ca]ss/, '.css'))

  if (opts.sourceMap) {
    opts.outFile = filePath.replace(/\.s[ca]ss/, '.css')
  }

  if (isAnySassFile(filename) === true) {
        // Append the file's base path to the available include paths.
    opts.includePaths.push(fileDir)

        // Compile the file using SASS.
    sass.render(opts, function (err, result) {
      var error = null

      if (err && err instanceof Error) {
        error = new Error([
          '[metalsmith-sass] Error: ',
          err.message, ' -> ',
          err.file,
          ':',
          err.line, ':', err.column
        ].join(''))
      } else if (err) {
        error = new Error(err)
      }

      if (error) {
        done(error)
        return
      }

          // add soure map
      if (result.map) {
        files[dest + '.map'] = {
          contents: result.map,
          mode: file.mode
        }
      }

          // replace contents
      file.contents = result.css

          // rename file extension
      files[dest] = file

      delete files[filename]
      done()
    })
  } else if (isPartial(filename) === true) {
    delete files[filename]
    done()
  } else {
    done()
  }
}

const compileSass = function compileSass (config, files, metalsmith, done) {
  /**
   * Looks up different key names on `metalsmith` to support
   * old versions (< v1) of Metalsmith. At some point, I will remove
   * support for < v1 and remove the key lookups
   */
  const directory = metalsmith.dir || metalsmith._directory
  const source = metalsmith._src || metalsmith._source
  const basePath = path.isAbsolute(source) ? source : path.join(directory, source)
  each(Object.keys(files), compile.bind(null, config, basePath, files), done)
}

const plugin = function plugin (options) {
  const config = options || {}
  return compileSass.bind(null, config)
}

// exposing node-sass types for custom functions. see:
// https://github.com/stevenschobert/metalsmith-sass/pull#21
plugin.types = sass.types
module.exports = plugin
