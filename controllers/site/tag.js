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
var EventProxy = require('eventproxy').EventProxy;
var cache = models.cache;

exports.index = function (req, res, next) {
  var dbname = req.params.domain.replace(/\./g, '');
  var conn = pool(dbname);

  var Tags = conn.model('Tags', domain.TagSchema);

  if (req.method === 'GET') {
    var cb = combo(function (err, site, tags) {
      if (err) return next(err);
      res.render('site/tag', {site: site, title: site.name, tags: tags[0], tagos: tags[1]});
    });

    Site.findOne({domain: req.params.domain}, cb.add());
    Tags.list(cb.add());
  } else if (req.method === 'POST') {
    var tag = new Tags(req.body);
    tag.save(function (err) {
      if (err) {
        res.message('标签添加失败。' + err, 0);
      } else {
        var message = '标签添加成功。';
        cache.cacheTag(tag, function (err, result) {
          if (err) {
            message += '缓存失败！' + err;
            res.message(message, 0);
          } else {
            res.message(message);
          }
        });
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
          var message = '标签修改成功。';
          cache.cacheTag(tag, function (err, result) {
            if (err) {
              message += '缓存失败！' + err;
              res.message(message, 0);
            } else {
              res.message(message);
            }
          });
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
          var message = '标签删除成功。';
          cache.deleteTag(tag, function (err, result) {
            if (err) {
              message += '缓存删除失败！' + err;
              res.message(message, 0);
            } else {
              res.message(message, 1, '../tag');
            }
          });
        }
      });
    });
  }
};

exports.cache = function (req, res, next) {
  var dbname = req.params.domain.replace(/\./g, '');
  var conn = pool(dbname);

  var Tags = conn.model('Tags', domain.TagSchema);

  Tags.find(function (err, tags) {
    if (err) {
      return res.message('标签加载失败！', 0);
    }

    var proxy = EventProxy.create();
    proxy.after('add', tags.length, function () {
      res.message('标签缓存成功。', 1, '../tag');
    });

    tags.forEach(function (tag) {
      cache.cacheTag(tag, function (err, result) {
        if (err) return next(err);
        proxy.trigger('add');
      });
    });
  });
};