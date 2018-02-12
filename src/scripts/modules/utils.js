/* globals module */

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
module.exports.debounce = function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}

// Example
// if (utils.isMobile() { console.log('is mobile device')})
module.exports.isMobile = function () {
  let check = false
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    check = true
  }
  return check
}

// Example
// if (utils.isAndroid() { console.log('is android device') })
module.exports.isAndroid = function () {
  return navigator.userAgent.match(/Android/i)
}

// Example
// if (utils.isiPhone()) { console.log('is iphone device') }
module.exports.isiPhone = function () {
  return navigator.userAgent.match(/iPhone/i)
}

// Example:
// utils.rAFscroll(drawLines)
// via https://gist.github.com/bradoyler/6037548a8c132184476fb5374c327da7
module.exports.rAFscroll = function (fn) {
  const rAF = window.requestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.msRequestAnimationFrame ||
               window.oRequestAnimationFrame ||
               // IE Fallback, you can even fallback to onscroll
               function (callback) { window.setTimeout(callback, 1000 / 60) }

  var lastPosition = -1
  function loop () {
    // Avoid calculations if not needed
    if (lastPosition === window.pageYOffset) {
      rAF(loop)
      return false
    } else lastPosition = window.pageYOffset
    fn()
    rAF(loop)
  }
  loop()
}
