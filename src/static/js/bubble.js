
function Bubble(settings) {

  var defaults = {
    width: 300,
    height: 300,
    air_percent: -.2,
    water_density: 1.5, //1.07
    bubble_frequency: 400, // ms between bubble add
    max_bubbles: 5, // 60 // max # bubbles'
    big_bubbles_dissolve: 20, // # of particles when explode
    small_bubble_dissolve: 6,
    is_circle: true,
    gradient_fill_pts: {
      0: '#2e2c6d',
      1: 'rgba(46,44,109,0)'
    }
  };
  var opts = _.extend({}, defaults, settings);

  var canvas, context, bubbles;

  var timeUpdateInterval, bubbleInterval, twitchInterval;

  this.Initialize = function( canvasID ) {
    canvas = document.getElementById( canvasID );

    if (canvas && canvas.getContext) {
      context = canvas.getContext('2d');

      bubbles = [];

      timeUpdateInterval = setInterval( TimeUpdate, 40 );
      bubbleInterval = setInterval( CreateBubble, opts.bubble_frequency );

      CreateBubble();

    }
  };

  function floatBubble(b) {
    b.velocity.y /= opts.water_density;
    b.velocity.y += -(b.y * 0.01) / b.mass;
    b.y += b.velocity.y;

    if (b.x > opts.width - b.currentSize) b.velocity.x = -b.velocity.x;
    if (b.x < b.currentSize) b.velocity.x = Math.abs(b.velocity.x);

    b.velocity.x /= 1.04;
    b.velocity.x = b.velocity.x < 0 ? Math.min(b.velocity.x, -.8 / b.mass) : Math.max(b.velocity.x, .8 / b.mass)
    b.x += b.velocity.x;
  }

  function burstBubble(b, context) {
    b.velocity.x /= 1.15;
    b.velocity.y /= 1.05;

    while (b.children.length < b.dissolveSize) {
      b.children.push({ x:0, y:0, size:Math.random() * b.dissolveSize, velocity:{ x:(Math.random() * 20) - 10, y:-(Math.random() * 10) } });
    }

    for (var j = 0; j < b.children.length; j++) {
      var c = b.children[j];
      c.x += c.velocity.x;
      c.y += c.velocity.y;
      c.velocity.x /= 1.1;
      c.velocity.y += 0.4;
      c.size /= 1.1;

      context.moveTo(b.x + c.x, b.y + c.y); // needed in ff
      context.arc(b.x + c.x, b.y + c.y, c.size, 0, Math.PI * 2, true);
    }
    return {j:j, c:c};
  }

  function TimeUpdate(e) {
    var pt;
    var gradientFill = context.createLinearGradient(opts.width*opts.air_percent,opts.height*.2,opts.width*.5,opts.height);
    for (pt in opts.gradient_fill_pts) {
      gradientFill.addColorStop(pt, opts.gradient_fill_pts[pt]);
    }

    context.clearRect(0, 0, opts.width, opts.height);
    context.fillStyle = gradientFill;
    if (opts.is_circle) {
      context.arc(opts.width / 2, opts.width / 2, 150, 0, Math.PI * 2, true);
      context.fill();
    } else {
      context.fillRect(0,0,opts.width, opts.height);
    }

    var len = bubbles.length;

    context.fillStyle = "#rgba(0,200,255,0)";
    context.beginPath();

    for (i = 0; i < len; i++) {
      var b = bubbles[i];
      floatBubble(b);

      if( b.dissolved == false ) {
        context.moveTo(b.x,b.y);
        context.arc(b.x,b.y,b.currentSize,0,Math.PI*2,true);
      }
      else {
        burstBubble(b, context);
      }

    }

    context.fill();
  }

  function CreateBubble() {
    if( bubbles.length > opts.max_bubbles ) {
      var i = 0;

      if( bubbles[i].dissolved ) {
        // Find a bubble thats not already on its way to dissolving
        for( ; i < bubbles.length; i++ ) {
          if( bubbles[i].dissolved == false ) {
            bubbles[i].dissolveSize = opts.small_bubble_dissolve;
            DissolveBubble( i );
            break;
          }
        }
      }
      else {
        DissolveBubble( i );
      }

    }

    var minSize = 15;
    var maxSize = 30;
    var size = minSize + Math.random() * ( maxSize - minSize );
    var catapult = 20;

    var b = {
      x: maxSize + ( Math.random() * ( opts.width - maxSize ) ),
      y: opts.height - maxSize,
      velocity: {x: (Math.random()*catapult)-catapult/2,y: 0},
      size: size,
      mass: (size / maxSize)+1,
      dissolved: false,
      dissolveSize: opts.big_bubbles_dissolve,
      children: []
    };

    b.currentSize = b.size;

    bubbles.push(b);
  }
  function DissolveBubble( index ) {
    var b = bubbles[index];

    if( b.dissolved == false ) {
      b.dissolved = true;

      setTimeout( function() {
        for( var i = 0; i < bubbles.length; i++ ) {
          if( bubbles[i] == b ) {
            bubbles.splice(i,1);
            break;
          }
        }

      }, 2000 );
    }
  }

  function DistanceBetween(p1,p2) {
    var dx = p2.x-p1.x;
    var dy = p2.y-p1.y;
    return Math.sqrt(dx*dx + dy*dy);
  }

}

