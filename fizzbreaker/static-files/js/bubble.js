
function Bubble() {

  var WIDTH = 300;
  var HEIGHT = 300;
  var AIR_PERCENT = -.2;

  var DETAIL = Math.round( WIDTH / 60 ); // The number of particles used to build up the wave
  var WATER_DENSITY = 1.5; //1.07;

  var BUBBLE_FREQUENCY = 400; // Milliseconds between bubbles being added to the wave

  var MAX_BUBBLES = 5; //60; // The maximum number of bubbles visible before FIFO is applied
  var BIG_BUBBLE_DISSOLVE = 20; // How many particles a bubble dissolves into when being clicked
  var SMALL_BUBBLE_DISSOLVE = 6;

  var canvas, context, particles, bubbles;

  var timeUpdateInterval, bubbleInterval, twitchInterval;

  this.Initialize = function( canvasID ) {
    canvas = document.getElementById( canvasID );

    if (canvas && canvas.getContext) {
      context = canvas.getContext('2d');

      particles = [];
      bubbles = [];

      // Generate our wave particles
      for( var i = 0; i < DETAIL+1; i++ ) {
        particles.push( {
          x: WIDTH / (DETAIL-4) * (i-2), // Pad by two particles on each side
          y: HEIGHT*AIR_PERCENT, // how full
          original: {x: 0, y: HEIGHT * AIR_PERCENT },
          velocity: {x: 0, y: Math.random()*3}, // Random for some initial movement in the wave
          force: {x: 0, y: 0},
          mass: 10
        } );
      }

      timeUpdateInterval = setInterval( TimeUpdate, 40 );
      bubbleInterval = setInterval( CreateBubble, BUBBLE_FREQUENCY );

      CreateBubble();

    }
  };

  function floatBubble(b) {
    b.velocity.y /= WATER_DENSITY;
    b.velocity.y += -(b.y * 0.01) / b.mass;
    b.y += b.velocity.y;

    if (b.x > WIDTH - b.currentSize) b.velocity.x = -b.velocity.x;
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

    var gradientFill = context.createLinearGradient(WIDTH*AIR_PERCENT,HEIGHT*.2,WIDTH*.5,HEIGHT);
    gradientFill.addColorStop(0,'#2e2c6d');
    gradientFill.addColorStop(1,'rgba(46,44,109,0)');

    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = gradientFill;
    context.beginPath();
    context.moveTo(particles[0].x, particles[0].y);

//    context.fillRect(0,0,WIDTH, HEIGHT);
    context.arc(150, 150, 150, 0, Math.PI*2, true);
    context.fill();

    var len = bubbles.length;

    context.fillStyle = "#rgba(0,200,255,0)";
    context.beginPath();

    var b, p, d;

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
    if( bubbles.length > MAX_BUBBLES ) {
      var i = 0;

      if( bubbles[i].dissolved ) {
        // Find a bubble thats not already on its way to dissolving
        for( ; i < bubbles.length; i++ ) {
          if( bubbles[i].dissolved == false ) {
            bubbles[i].dissolveSize = SMALL_BUBBLE_DISSOLVE;
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
    var catapult = 30;

    var b = {
      x: maxSize + ( Math.random() * ( WIDTH - maxSize ) ),
      y: HEIGHT - maxSize,
      velocity: {x: (Math.random()*catapult)-catapult/2,y: 0},
      size: size,
      mass: (size / maxSize)+1,
      dissolved: false,
      dissolveSize: BIG_BUBBLE_DISSOLVE,
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

