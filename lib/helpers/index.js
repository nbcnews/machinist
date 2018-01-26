const handlebars = require('handlebars')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const typogr = require('typogr')

// Helper Documentation: https://git.io/v6hSQ
const hbsHelpers = require('handlebars-helpers')({ handlebars })

// TODO: break into seperate files
const helpers = {
  isoDate: function (dateValue) {
    const jsDate = new Date(dateValue)
    return moment(jsDate).toISOString()
  },

  formatDate: function (dateValue, formatOutput) {
    const jsDate = new Date(dateValue)
    return moment(jsDate).format(formatOutput)
  },

  typogrFormat: function (value) {
    return typogr(value).chain().initQuotes().smartypants().value()
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

  safeRead: function (filepath, options) {
    let content
    try {
      content = fs.readFileSync(filepath, 'utf8')
    } catch (ex) {
      console.error(ex)
      content = ex
    }

    return content
  },

  assetsURL: function (value) {
    if (process.env.BUILD === 'development') {
      return path.join('assets/', value)
    }
    return path.join('.tmp/assets', value)
  },

  keyCount: function (arr, prop, key) {
    const properties = arr.filter(function (arr) {
      return arr[prop] === key
    })
    return properties.length
  }
}

// merge all the helpers
Object.assign(helpers, hbsHelpers)

module.exports = helpers
