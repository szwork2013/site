/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../models');
var Site = models.Site;
var Type = models.Type;
var Combo = require('combo').Combo;

exports.index = function (req, res) {
  res.render('site/index');
};

exports.add = function (req, res) {
  if (req.method === 'GET') {
    var site = new Site();
    Type.find({}, function (err, types){
      if (err) types = [];
      res.render('site/edit', {site: site, types: types});
    });
  } else if (req.method === 'POST') {
    var site = new Site(req.body);
    console.log(req.body);
    site.save(function(err){
      console.log(err);
      res.redirect('/site/list');
    });
  }
};

exports.list = function (req, res) {
  var cb = new Combo(function(sites, types) {
    res.render('site/list', {sites: sites[1], types: types[1]});
  });

  Site.find({}, cb.add());
  Type.list({}, cb.add());
};

exports.type = function (req, res) {
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
          res.redirect('/site/type');
        });
      });
    } else {
      type.name = req.body.name;
      type.save(function (err) {
        res.redirect('/site/type');
      });
    }
  } else {
    Type.findById(req.params.id, function (err, type) {
      if (err || !type) {
        res.json({ok: 0, message: '类别不存在，删除失败！'});
        return;
      }

      type.remove(function (err) {
        if (err) {
          res.json({ok: 0, message: '类别删除失败：' + err.message});
          return;
        }

        res.json({ok: 1, message: '删除成功。'});
      });
    });
  }

};
