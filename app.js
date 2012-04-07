/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var express = require('express');
var config = require('./config').config;
var routes = require('./routes');
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

app.configure('development', function () {
  app.use(express.logger('dev'));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

app.helpers({
  util: util,
  title: config.name
});

app.dynamicHelpers({
  user: function (req, res) {
    return req.session.user ? req.session.user : 'user';
  }
});

app.error(function (err, req, res, next) {
  next(err);
});

app.all('/web', routes.web.index);
app.get('/check', routes.web.check);
app.all('/type/:id?', routes.type);
app.get('/list/:type?', routes.list);
app.all('/tag', routes.tag);
app.all('/site/:domain/article', routes.site.article);
app.all('/site/:domain/category', routes.site.category);
app.all('/site/:domain/tag', routes.site.tag);
app.all('/site/:domain/setting', routes.site.setting);
app.all('/site/:domain/publish', routes.site.publish);
app.all('/site/:domain/draft', routes.site.draft);
app.get('/site/:domain', routes.site.home);
app.get('/server', routes.server.index);
app.get('/server/start', routes.server.start);
app.get('/server/restart', routes.server.restart);
app.get('/server/killall', routes.server.killall);
app.get('/login', routes.login);
app.post('/login', routes.login);
app.get('/post/:domain', routes.post);
app.post('/post/:domain', routes.post);
app.get('/', routes.home);


app.listen(config.port);
console.log("App listening on port %d in %s mode", app.address().port, app.settings.env);
