
module.exports = function (revealBtn = '[data-sset="reveal"]', revealClose = '[data-sset="reveal-close"]', revealContainer = '.reveal__container') {
  var $revealBtn = $(revealBtn)
  var $revealClose = $(revealClose)

  $revealBtn.click(function (e) {
    e.preventDefault()
    var revealSelector = $(this).data('id')
    var $revealEl = $(`#${revealSelector}`)
    var $revealElContainer = $(`#${revealSelector} ${revealContainer}`)
    $revealEl.height($revealElContainer.outerHeight(true))
    if ($revealEl.hasClass('is-active')) {
      $revealEl.removeClass('is-active')
      $revealEl.height(0)
    } else {
      $('.reveal.is-active').removeClass('is-active')
      $revealEl.toggleClass('is-active')
      $revealEl.height($revealElContainer.outerHeight(true))
    }
  })

  $revealClose.click(function (e) {
    e.preventDefault()
    var revealSelector = $(this).data('id')
    var $revealEl = $(`#${revealSelector}`)
    $revealEl.removeClass('is-active')
    $revealEl.height(0)
  })
}
