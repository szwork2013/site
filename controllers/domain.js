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
  Site.findOne({domain: req.params.domain}, function (err, site) {
    if (err) return next(err);

    res.render('domain/index', {site: site, title: site.name});
  });
};

exports.article = function (req, res, next) {
  var dbname = req.params.domain.replace(/\./g, '');
  var conn;

  if (connectionPool[dbname]) {
    conn = connectionPool[dbname];
  } else {
    conn = mongoose.createConnection('mongodb://127.0.0.1/' + dbname);
    connectionPool[dbname] = conn;
  }

  res.render('domain/article');
};

exports.tag = function (req, res, next) {
  var dbname = req.params.domain.replace(/\./g, '');
  var conn;

  if (connectionPool[dbname]) {
    conn = connectionPool[dbname];
  } else {
    conn = mongoose.createConnection('mongodb://127.0.0.1/' + dbname);
    connectionPool[dbname] = conn;
  }

  var Tags = conn.model('Tags', Domain.TagSchema);

  if (req.method === 'GET') {
    var cb = combo(function (err, site, tags) {
      if (err) return next(err);
      res.render('domain/tag', {site: site, title: site.name, tags: tags[0], tagos: tags[1]});
    });

    Site.findOne({domain: req.params.domain}, cb.add());
    Tags.list(cb.add());
  } else if (req.method === 'POST') {
    var tag = new Tags(req.body);
    tag.save(function (err) {
      if (err) {
        res.message('标签添加失败。' + err, 0);
      } else {
        res.message('标签添加成功。');
      }
    });
  } else if (req.method === 'PUT') {
    var id = req.body.id;
    Tags.findById(id, function (err, tag) {
      if (err) return res.message('标签不存在！');

      tag.name = req.body.name;
      tag.title = req.body.title;
      tag.url = req.body.url;
      tag.external = req.body.external;
      tag.keyword = req.body.keyword;
      tag.description = req.body.description;
      tag.save(function (err) {
        if (err) {
          res.message('标签修改失败！' + err, 0);
        } else {
          res.message('标签修改成功。');
        }
      });
    });
  } else if (req.method === 'DELETE') {
    var id = req.body.id;
    Tags.findById(id, function (err, tag) {
      if (err) return res.message('标签不存在！');

      tag.remove(function (err) {
        if (err) {
          res.message('标签删除失败！', 0);
        } else {
          res.message('标签删除成功。');
        }
      });
    });
  }
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
      res.render('domain/category', {site: site, title: site.name, categories: categories[0], categoryos: categories[1]});
    });

    Site.findOne({domain: req.params.domain}, cb.add());
    Category.list(cb.add());
  } else if (req.method === 'POST') {
    Site.findOne({domain: req.params.domain}, function (err, site) {
      if (err) return next(err);

      var category = new Category(req.body);
      category.save(function (err) {
        if (err) return next(err);

        res.message('栏目[' + category.name + ']添加成功。');
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
          res.message('栏目[' + category.name + ']修改失败！', 0);
        } else {
          res.message('栏目[' + category.name + ']修改成功。');
        }
      });
    });

  } else if (req.method === 'DELETE') {
    var id = req.body.id;
    Category.findById(id, function (err, category) {
      if (err) return next(err);

      category.remove(function (err) {
        if (err) {
          res.message('栏目[' + category.name + ']删除失败！', 0);
        } else {
          res.render('栏目[' + category.name + ']删除成功。');
        }
      });
    });
  }
};