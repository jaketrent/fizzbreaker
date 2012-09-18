
var express = require('express')
  , root = require('./routes/root')
  , services = require('./routes/services')
  , creations = require('./routes/creations')
  , contact = require('./routes/contact')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/static/img/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/static'));
  app.use(express.static(path.join(__dirname, 'static')));
  app.use(function (err, req, res, next) {
    res.render('500.jade', { status: 500 });
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', root.index);
app.get('/services', services.index);
app.get('/creations', creations.index);
app.get('/contact', contact.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
