/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../models');
var Site = models.Site;
var Type = models.Type;
var nginx = require('../server/nginx');

exports.index = function (req, res, next) {
  if (req.method === 'GET') {
    Type.find({}, function (err, types) {
      if (err) return next(err);
      res.render('add', {types: types});
    })
  } else if (req.method === 'POST') {
    var site = new Site(req.body);
    site.save(function (err) {
      if (err) return next(err);

      nginx.conf(site, function (err) {
        if (err) return next(err);

        var action = nginx.status() ? 'reload' : 'start';
        nginx.action(action, function (err) {
          if (err) {
            res.message('站点添加成功,更新nginx时发生错误' + err, 0);
          }
          else {
            res.message('站点添加成功', 1, '/list/' + site.type);
          }
        });
      });
    });
  }
};

exports.check = function (req, res) {
  var type = req.param('type');
  var value = req.param('value');

  var query = {};
  query[type] = value;

  Site.count(query, function (err, count) {
    if (err || count) {
      res.send({exists: 1});
    }
    else {
      res.send({exists: 0});
    }
  });
};