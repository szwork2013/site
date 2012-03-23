/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var models = require('../models');
var Domain = models.Domain;
var Site = models.Site;
var combo = require('combo').combo;

var connectionPool = {};

exports.index = function (req, res, next) {
  /*
   var dbname = 'testsite';
   var conn;

   if (connectionPool[dbname]) {
   conn = connectionPool[dbname];
   } else {
   conn = mongoose.createConnection('mongodb://127.0.0.1/' + dbname);
   }

   var Article = conn.model('Article', Model.ArticleSchema);
   var Category = conn.model('Category', Model.CategorySchema);
   var Content = conn.model('Content', Model.ContentSchema);
   */
  Site.findOne({domain: req.params.domain}, function (err, site) {
    if (err) return next(err);

    res.render('domain/index', {site: site, title: site.name});
  });
};

exports.tag = function (req, res, next) {
  //var Tag = conn.model('Tag', Model.TagSchema);

  res.render('domain/tag');
};

exports.category = function (req, res, next) {

  var dbname = req.params.domain.replace(/\./g, '');
  var conn;

  if (connectionPool[dbname]) {
    conn = connectionPool[dbname];
  } else {
    conn = mongoose.createConnection('mongodb://127.0.0.1/' + dbname);
    connectionPool[dbname] = conn;
  }

  var Category = conn.model('Category', Domain.CategorySchema);

  if (req.method === 'GET') {

    var cb = combo(function (err, site, categories) {
      if (err) return next(err);

      res.render('domain/category', {site: site, categories: categories[0], categoryos: categories[1]});
    });

    Site.findOne({domain: req.params.domain}, cb.add());
    Category.list(cb.add());
    console.log(req.url);
  } else if (req.method === 'POST') {
    Site.findOne({domain: req.params.domain}, function (err, site) {
      if (err) return next(err);

      var Category = conn.model('Category', Domain.CategorySchema);

      var category = new Category(req.body);
      category.save(function (err) {
        if (err) return next(err);

        res.render('message', {status: 1, message: '栏目[' + category.name + ']添加成功。', url: req.url});
      });
    });

  } else if (req.method === 'PUT') {
    var id = req.body.id;
    Category.findById(id, function (err, category) {
      if (err) return next(err);

      category.name = req.body.name;
      category.title = req.body.title;
      category.url = req.body.url;
      category.keyword = req.body.keyword;
      category.description = req.body.description;
      category.template = req.body.template;
      category.advertment = req.body.advertment;

      category.save(function (err) {
        if (err) {
          res.message(0, '栏目[' + category.name + ']修改失败！');
        } else {
          res.message(1, '栏目[' + category.name + ']修改成功。');
        }
      });
    });

  } else if (req.method === 'DELETE') {
    var id = req.body.id;
    Category.findById(id, function (err, category) {
      if (err) return next(err);

      category.remove(function (err) {
        if (err) {
          res.render('message', {status: 0, message: '栏目[' + category.name + ']删除失败！', url: req.url})
        } else {
          res.render('message', {status: 0, message: '栏目[' + category.name + ']删除成功。', url: req.url})
        }
      });
    });
  }
};