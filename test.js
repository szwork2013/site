/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var express = require('express');
var config = require('./config').config;
var util = require('./lib/util');

var app = express.createServer();

app.configure(function () {
  app.use(express.favicon());
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register('.html', require('ejs'));
  app.use(express.bodyParser());
  app.use(express.methodOverride())
  app.use(express.cookieParser());
  app.use(express.session({key: config.session.key, secret: config.session.secret}));
  app.use(util.message());
});

app.listen(4000);
console.log(app.address().port);