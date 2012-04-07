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
  var Article = conn.model('Article', domain.ArticleSchema);

  if (req.method === 'GET') {
    var cb = combo(function (err, site, count, articles, categories) {
      res.render('site/article', {site: site, title: site.name, count: count, articles: articles, categories: categories[0],  categoryos: categories[1]});
    });

    var Category = conn.model('Category', domain.CategorySchema);

    Site.findOne({domain: req.params.domain}, cb.add());
    Article.count(cb.add());
    Article.find({}).limit(20).run(cb.add());
    Category.list(cb.add());
  } else if (req.method === 'POST') {
    req.body.url = Math.floor(Math.random() * 1000);
    var article = new Article(req.body);
    article.save(function (err) {
      if (err) return res.message(err, 0);

      res.message('文章发布成功');
    });
  }

}