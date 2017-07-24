const Handlebars = require('handlebars')
const moment = require('moment')

// Helper Documentation: https://git.io/v6hSQ
require('handlebars-helpers')({
  handlebars: Handlebars
})

const typogr = require('typogr')

module.exports = {

  isoDate: function (dateValue) {
    const jsDate = new Date(dateValue)
    return moment(jsDate).toISOString()
  },

  formatDate: function (dateValue, formatOutput) {
    const jsDate = new Date(dateValue)
    return moment(jsDate).format(formatOutput)
  },

  typogrFormat: function (value) {
    return typogr(value).chain().initQuotes().smartypants().caps().value()
  },

  ifOr: function (var1, var2, options) {
    return (var1 || var2) ? options.fn(this) : options.inverse(this)
  },

  ifAnd: function (var1, var2, options) {
    return (var1 && var2) ? options.fn(this) : options.inverse(this)
  },

  ifEqual: function (val, test, options) {
    if (typeof test === 'undefined') {
      return options.inverse(this)
    }
    if (typeof test === 'number' || typeof test === 'boolean') {
      if (val === test) {
        return options.fn(this)
      } else {
        return options.inverse(this)
      }
    }
    const arrTest = test.split('||')
    for (var i = 0; i < arrTest.length; i++) {
      if (val === arrTest[i]) {
        return options.fn(this)
      }
    }
    return options.inverse(this)
  },

  concat: function () {
    var arg = Array.prototype.slice.call(arguments, 0)
    arg.pop()
    return arg.join('')
  },

  assetsURL: function (value) {
    var assetPath

    if (process.env.development) {
      assetPath = 'assets/'
    } else {
      assetPath = '.tmp/assets/'
    }

    return assetPath + value
  }
}
