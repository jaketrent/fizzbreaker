require({
  paths: {
    text: './vendor/text',
    handlebars: './vendor/handlebars',
    tmpl: './tmpl'
  },
  shim: {
    'vendor/backbone': {
      deps: ['vendor/underscore', 'vendor/zepto'],
      exports: 'Backbone'
    }
  }
}, ['require', 'vendor/backbone'], function (require) {
  require(['Bubble'], function(Bubble) {
    $(function () {

      function getColor(elm) {
        if (elm && elm.length > 0) {
          var colors = {
            green: {
              0: 'rgba(153, 200, 30, 1)',
              1: 'rgba(153, 200, 30, 0.8)'
            },
            pink: {
              0: 'rgba(232, 101, 224, 1)',
              1: 'rgba(232, 101, 224, 0.8)'
            },
            orange: {
              0: 'rgba(250, 179, 41, 1)',
              1: 'rgba(250, 179, 41, 0.8)'
            }
          };
          return colors[elm.attr('class').match('color-[a-z]*')[0].substr('color-'.length)];
        } else {
          return {};
        }
      }

      var bubble = new Bubble();
      bubble.Initialize('bubble');

      var $window = $(window);
      var height = $window.height();
      var width = $window.width();
      $('#bubble-column')
        .attr('height', height)
        .attr('width', width / 10);

      var bubbleCol = new Bubble({
        height: height,
        width: 100,
        is_circle: false,
        gradient_fill_pts: getColor($('.content')),
        air_percent:0,
        water_density: 2.5
      });
      bubbleCol.Initialize('bubble-column');
    });
  });
});