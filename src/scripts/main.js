/* globals videojs, c3 */

$(document).ready(function () {
  // Pauses other videoJS
  $('.video-js').each(function (videoIndex) {
    var videoId = $(this).attr('id')

    videojs(videoId).ready(function () {
      this.on('play', function () {
        // pause other video
        $('.video-js').each(function (index) {
          if (videoIndex !== index) {
            this.player.pause()
          }
        })
      })
    })
  })

  var videoMap = document.getElementById('flyover_html5_api')

  $(videoMap).waypoint(function () {
    videoMap.play()
    this.destroy()
  }, {
    offset: '50%'
  })

  c3.generate({
    bindto: '#chart-gas-consumption-reserves',
    data: {
      json: {
        'year': [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
        'U.S. Gas Consumption': [19174, 19562, 20228, 20790, 21247, 22207, 22609, 22737, 22246, 22405, 23333, 22239, 23007, 22277, 22403, 22014, 21699, 23104, 23277, 22910, 24087, 24477, 25538, 26168, 26819],
        'World Gas Consumption': [73542, 75350, 75305, 76893, 76986, 79029, 81007, 81094, 81635, 83778, 87237, 87702, 91337, 93756, 96905, 99486, 102038, 105545, 108917, 105326, 113858, 116395, 119696, 121357, 'NA'],
        'U.S. Gas Reserves': [167116, 169346, 167062, 165015, 162415, 163837, 165146, 166474, 167223, 164041, 167406, 177427, 183460, 186946, 189044, 192513, 204385, 211085, 237726, 244656, 272509, 304625, 334067, 308036, 338264, 'NA']
      },
      x: 'year'
    },
    point: {
      show: false
    },
    color: {
      pattern: ['#2b6f6e', '#339895', '#c88010']
    },
    axis: {
      y: {
        tick: {
          outer: false
        }
      },
      x: {
        tick: {
          outer: false
        }
      }
    },
    grid: {
      y: {
        show: true
      },
      x: {
        show: true
      }
    }
  })
})
