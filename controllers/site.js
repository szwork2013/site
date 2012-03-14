/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../models');
var Site = models.Site;
var Type = models.Type;
var Combo = require('combo').Combo;
var nginx = require('../server/nginx');

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

        res.redirect('/site/list/' + site.type);
      });
    });
  }
};

exports.edit = function (req, res, next) {
  if (req.method === 'GET') {
    var cb = new Combo(function (site, types) {
      if (site[0] || types[0]) return next(site[0] || types[0]);
      res.render('site/edit', {site: site[1], types: types[1]});
    });

    Site.findById(req.params.id, cb.add());
    Type.find({}, cb.add());

  } else if (req.method === 'POST') {
    Site.findById(req.body.id, function (err, site) {
      if (err) return next(err);

      var modifySiteConf = false;

      if (site.domain !== req.body.domain || site.path !== req.body.path) {
        modifySiteConf = true;
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

        nginx.conf(site, function (err) {
          if (err) return next(err);

          var action = nginx.status() ? 'reload' : 'start';
          nginx.action(action, function (err) {
            if (err) {
              res.render('message', {status: 0, message: '站点修改成功,更新nginx时发生错误' + err});
            }else {
              res.render('message', {status: 1, message: '站点修改成功', url: '/site/list/' + site.type});
            }
          });
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

exports.list = function (req, res, next) {
  var curtype = req.params.type;

  var cb = new Combo(function (sites, types, sitesByType) {
    res.render('site/list', {curtype: curtype, sites: sites[1], types: types[1], typeos: types[2], sitesByType: sitesByType[1]});
  });

  Site.find(curtype ? {type: curtype} : {}, cb.add());
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

exports.detail = function (req, res) {

};
