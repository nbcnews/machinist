var $offcanvasClose = $('[data-sset="offcanvas-close"]')

$($offcanvasClose).click(function () {
  $('.offcanvas.is-active').removeClass('is-active')
})

var $revealBtn = $('[data-sset="reveal"]')

$revealBtn.click(function (e) {
  e.preventDefault()
  var revealSelector = $(this).data('id')
  var $revealEl = $('#' + revealSelector)
  var $revealElContainer = $('#' + revealSelector + ' ' + '.reveal__container *')
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
