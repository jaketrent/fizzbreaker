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
      var $bubbleColumnCanvas = $('#bubble-column');
      var $bubbleColumnDiv = $('.bubble-col');

      function resizeBubbleColumn() {
        var height = $window.height();
        var width = $window.width();
        var colWidth = width / 10;
        var dimensions = {
          'height': height,
          'width': colWidth
        };
        console.log('height: ' + height + ', width: ' + colWidth);
        $bubbleColumnDiv.css(dimensions);
        return dimensions
      }
      $window.resize(resizeBubbleColumn);
      var dims = resizeBubbleColumn();
      $bubbleColumnCanvas
        .attr('height', dims.height)
        .attr('width', dims.width);

      var bubbleCol = new Bubble({
        height: dims.height,
        width: dims.width,
        is_circle: false,
        gradient_fill_pts: getColor($('.content')),
        air_percent:0,
        water_density: 2.5,
        make_explode: false,
        min_bubble_size: 10,
        max_bubble_size: 25
      });
      bubbleCol.Initialize('bubble-column');
    });
  });
});