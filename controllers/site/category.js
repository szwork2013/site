/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../../models');
var Site = models.Site;
var domain = models.domain;
var pool = models.pool;
var combo = require('combo').combo;

exports.index = function (req, res, next) {
  var dbname = req.params.domain.replace(/\./g, '');
  var conn = pool(dbname);
  var Category = conn.model('Category', domain.CategorySchema);
  var Article = conn.model('Article', domain.ArticleSchema);

  if (req.method === 'GET') {

    var cb = combo(function (err, site, categories) {
      if (err) return next(err);
      res.render('site/category', {site: site, title: site.name, categories: categories[0], categoryos: categories[1], article: Article});
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
      category.listtpl = req.body.listtpl;
      category.showtpl = req.body.showtpl;
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

      if (category === null) {
        res.message('栏目不存在！', 0);
        return;
      }

      category.remove(function (err) {
        if (err) {
          res.message('栏目[' + category.name + ']删除失败！', 0);
        } else {
          res.message('栏目[' + category.name + ']删除成功。');
        }
      });
    });
  }
};