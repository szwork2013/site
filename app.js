/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var express = require('express');
var config = require('./config').config;
var routes = require('./routes');

var app = express.createServer();

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register('.html',require('ejs'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({key: config.session.key, secret: config.session.secret}));
  app.use(app.router);
});

app.configure('development', function () {
  app.use(express.logger('dev'));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/login', routes.login.index);
app.post('/login', routes.login.index);

app.get('/site/overview', routes.site.index);
app.all('/site/add', routes.site.add);
app.all('/site/type/:id?', routes.site.type);
app.get('/site/list/:type?', routes.site.list);
app.get('/site', routes.site.index);

app.listen(config.port);
console.log("App listening on port %d in %s mode", app.address().port, app.settings.env);

