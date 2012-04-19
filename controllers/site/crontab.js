/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../../models');
var Site = models.Site;
var pool = models.pool;
var domain = models.domain;
var EventProxy = require('eventproxy').EventProxy;
var redis = models.redis;
var publish = require('../../lib/publish');

exports.index = function (req, res, next) {
  var dbname = req.params.domain.replace(/\./g, '');
  var conn = pool(dbname);

  var proxy = EventProxy.create();

  proxy.assign('drafts', 'tags', 'siteTags', function (drafts, tags, siteTags) {
    var Article = conn.model('Article', domain.ArticleSchema);
    tags = siteTags.concat(tags);
    console.log(tags[0]);
    //res.send('tags: ' + tags.length);

    drafts.forEach(function (draft) {
      publish.article(draft, tags, function (err, article) {
        if (err) return next(err);
        console.log(article);
      });
    });

  });

  proxy.on('site', function (site) {
    var Draft = conn.model('Draft', domain.DraftSchema);

    Draft.rfind(site.publish.count, function (err, drafts) {
      if (err) return next(err);

      proxy.trigger('drafts', drafts);
    });

    redis.smembers(dbname + '.tags', function (err, siteTagIds) {
      if (err) return next(err);
      var len = siteTagIds.length;
      var siteTags = [];
      siteTagIds.forEach(function (id) {
        redis.hgetall(dbname + '.tag.' + id, function (err, tag) {
          if (err) return next(err);
          siteTags.push(tag);
          --len || proxy.trigger('siteTags', siteTags);
        });
      });
    });

    redis.sdiff('test.tags', dbname + '.tags', function (err, tagIds) {
      if (err) return next(err);
      var len = tagIds.length;
      var tags = [];
      tagIds.forEach(function (id) {
        redis.hgetall('test.tag.' + id, function (err, tag) {
          if (err) return next(err);
          tags.push(tag);
          --len || proxy.trigger('tags', tags);
        });
      });
    });
  });

  Site.findOne({domain: req.params.domain}, function (err, site) {
    if (err) return next(err);

    proxy.trigger('site', site);
  });

};
