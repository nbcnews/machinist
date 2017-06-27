var $offcanvasClose = $('[data-sset="offcanvas-close"]')
var $offcanvasEls = $('.offcanvas')
var $offcanvasBtn = $('[data-sset="offcanvas"]')

$offcanvasClose.click(function () {
  $('.offcanvas.is-active, .shade').removeClass('is-active')
  $('html').removeClass('is-stuck')
  $offcanvasBtn.removeClass('is-active')
})

$offcanvasEls.click(function (e) {
  e.stopPropagation()
})

$offcanvasBtn.click(function (e) {
  e.preventDefault()
  e.stopPropagation()
  var offcanvasSelector = $(this).data('ocid')
  var $offcanvasEl = $('#' + offcanvasSelector)

  if ($offcanvasEl.hasClass('is-active')) {
    $offcanvasEl.removeClass('is-active')
    $('.shade').removeClass('is-active')
    $('html').removeClass('is-stuck')
    $(this).removeClass('is-active')
  } else {
    $('.offcanvas.is-active').removeClass('is-active')
    $offcanvasEl.toggleClass('is-active')
    $('.shade').toggleClass('is-active')
    $('html').toggleClass('is-stuck')
    $(this).toggleClass('is-active')
  }
})

$('html').click(function () {
  $offcanvasEls.removeClass('is-active')
  $('html').removeClass('is-stuck')
  $('.shade').removeClass('is-active')
  $offcanvasBtn.removeClass('is-active')
})
