/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var express = require('express');
var config = require('./config').config;

var app = express.createServer();

var staticDir = __dirname + '/public';

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register('.html',require('ejs'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.sessionSecret
  }));
});

app.configure('development', function () {
  app.use(express.logger('dev'));
  app.use(express.static(staticDir));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
  app.use(express.static(staticDir, {maxAge: 86400}));
  app.use(express.errorHandler());
  app.set('view cache', true);
});

app.get('/', function(req, res){
  res.render('index');
});

app.listen(config.port);
console.log("App listening on port %d in %s mode", app.address().port, app.settings.env);

