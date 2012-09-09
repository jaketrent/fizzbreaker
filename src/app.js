
var express = require('express')
  , root = require('./routes/root')
  , services = require('./routes/services')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/static'));
  app.use(express.static(path.join(__dirname, 'static')));
  app.use(function (err, req, res, next) {
    res
      .status(404)
      .render('404.jade', { status: 404 })
      .status(500)
      .render('404.jade', { status: 500 });
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', root.index);
app.get('/services', services.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
