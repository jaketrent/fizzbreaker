$(function () {
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
    gradient_fill_pts: {
      0: 'rgba(153, 200, 30, 1)',
      1: 'rgba(153, 200, 30, .8)'
    },
    air_percent:0,
    water_density: 2.5
  });
  bubbleCol.Initialize('bubble-column');
});