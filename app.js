/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var express = require('express');
var config = require('./config').config;
var routes = require('./routes');
var util = require('./utils/util');

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
  app.use(function(req, res, next){
    res.message = function message(message, status, url) {
      status = status || 1;
      message = message || '操作已成功。';
      url = url || req.url;

      this.render('message', {status: status, message: message, url: url});
    };

    return next();
  });
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
app.get('/web/check', routes.web.check);
app.all('/type/:id?', routes.type);
app.get('/list/:type?', routes.list);
app.all('/tag', routes.tag);
app.all('/site/:site/article', routes.article);
app.all('/site/:site/category', routes.category);
app.all('/site/:site/tag', routes.site.tag);
app.all('/site/:site/publish', routes.site.publish);
app.get('/site/:site', routes.site.home);
app.get('/server', routes.server.index);
app.get('/server/start', routes.server.start);
app.get('/server/restart', routes.server.restart);
app.get('/server/killall', routes.server.killall);
app.get('/login', routes.login);
app.post('/login', routes.login);
app.get('/', routes.home);


app.listen(config.port);
console.log("App listening on port %d in %s mode", app.address().port, app.settings.env);
