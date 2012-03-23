/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../models');
var Site = models.Site;
var Type = models.Type;
var combo = require('combo').combo;
var nginx = require('../server/nginx');
var path = require('path');
var fs = require('fs');
var config = require('../config').config;

exports.index = function (req, res) {
  res.render('site/index');
};

exports.add = function (req, res, next) {
  if (req.method === 'GET') {
    var site = new Site();
    Type.find({}, function (err, types) {
      if (err) return next(err);

      res.render('site/edit', {site: site, types: types});
    });
  } else if (req.method === 'POST') {
    var site = new Site(req.body);
    site.save(function (err) {
      if (err) return next(err);

      nginx.conf(site, function (err) {
        if (err) return next(err);

        var action = nginx.status() ? 'reload' : 'start';
        nginx.action(action, function (err) {
          if (err) {
            res.render('message', {status: 0, message: '站点添加成功,更新nginx时发生错误' + err});
          }
          else {
            res.render('message', {status: 1, message: '站点添加成功', url: '/site/list/' + site.type});
          }
        });
      });
    });
  }
};

exports.edit = function (req, res, next) {
  if (req.method === 'GET') {
    var cb = combo(function (err, site, types) {
      if (err) return next(err);

      res.render('site/edit', {site: site, types: types});
    });

    Site.findById(req.params.id, cb.add());
    Type.find({}, cb.add());

  } else if (req.method === 'POST') {
    Site.findById(req.body.id, function (err, site) {
      if (err) return next(err);

      if (!site) {
        res.render('message', {status: 0, message: '该网站不存在', url: '/site/list'});
      }

      var needUpdateNginx = false;
      var originDomain = site.domain;

      if (site.domain !== req.body.domain) {
        needUpdateNginx = true;
      }

      if (site.path !== req.body.path) {
        needUpdateNginx = true;
      }

      site.name = req.body.name;
      site.domain = req.body.domain;
      site.path = req.body.path;
      site.ip = req.body.ip;
      site.type = req.body.type;
      site.keyword = req.body.keyword;
      site.description = req.body.description;
      site.urltype = req.body.urltype;
      site.template = req.body.template;
      site.advertment = req.body.advertment;

      site.save(function (err) {
        if (err) return next(err);

        if (needUpdateNginx) {

          if (originDomain !== site.domain) {
            var confpath = path.join(config.nginx.conf, originDomain) + '.conf';
            if (path.existsSync(confpath)) {
              fs.unlinkSync(confpath);
            }
          }

          nginx.conf(site, function (err) {
            if (err) return next(err);

            var action = nginx.status() ? 'reload' : 'start';
            nginx.action(action, function (err) {
              if (err) {
                res.render('message', {status: 0, message: '站点修改成功,更新nginx时发生错误' + err});
              } else {
                res.render('message', {status: 1, message: '站点修改成功', url: '/site/list/' + site.type});
              }
            });
          });
        } else {
          res.render('message', {status: 1, message: '站点修改成功', url: '/site/list/' + site.type});
        }
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

exports.list = function (req, res, next) {
  var curtype = req.params.type;
  var cb = combo(function (err, sites, types, sitesByType) {
    if (err) return next(err);

    res.render('site/list', {curtype: curtype, sites: sites, types: types[0], typeos: types[1], sitesByType: sitesByType});
  });

  Site.find(curtype ? {type: curtype} : {}).desc('_id').run(cb.add());
  Type.list(cb.add());
  Type.sitesByType(cb.add());
};

exports.type = function (req, res, next) {
  if (req.method === 'GET') {
    Type.find({}, function (err, types) {
      res.render('site/type', {types: types});
    });

  } else if (req.method === 'POST') {
    var type = new Type();
    if (req.body.id) {
      Type.findById(req.body.id, function (err, type) {
        type.name = req.body.name;
        type.save(function (err) {
          if (err) return next(err);

          res.redirect('/site/type');
        });
      });
    }
    else {
      type.name = req.body.name;
      type.save(function (err) {
        if (err) return next(err);

        res.redirect('/site/type');
      });
    }

  }
  else {
    Type.findById(req.params.id, function (err, type) {
      if (err || !type) {
        res.send({ok: 0, message: '类别不存在，删除失败！'});
        return;
      }

      type.remove(function (err) {
        if (err) {
          res.send({ok: 0, message: '类别删除失败：' + err.message});
          return;
        }

        res.send({ok: 1, message: '删除成功。'});
      });
    });
  }

};
