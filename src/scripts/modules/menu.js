$('[data-sset="menu"]').on('click', function () {
  $('[data-sset="site-header"]').toggleClass('is-menu-open')
  $('body, html').toggleClass('is-menu-open')
  $('[data-sset="site-header-nav"]').toggleClass('is-active')
  $(this).toggleClass('is-active')
})
