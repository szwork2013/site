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

  var siteTagIds = [];

  var proxy = EventProxy.create();
  proxy.assign('drafts', 'tags', 'siteTags', function (drafts, tags, siteTags) {
    tags = siteTags.concat(tags);

    /*
     drafts.forEach(function (draft) {
     publish.article(draft, tags, function (err, article, content) {
     if (err) return next(err);

     publish.content(article, content, tags, function(err, content) {
     if (err) return next(err);
     //console.log(content);
     });


     if (article.tags.length) {
     article.tags.forEach(function(tag){
     if (siteTagIds.indexOf(tag) === -1) {

     }
     });
     }
     });
     });
     */

    res.send('tag: ' + tags.length);
  });

  proxy.on('site', function (site) {
    var Draft = conn.model('Draft', domain.DraftSchema);

    Draft.rfind(site.publish.count, function (err, drafts) {
      if (err) return next(err);

      proxy.trigger('drafts', drafts);
    });

    redis.smembers(dbname + '.tags', function (err, ids) {
      if (err) return next(err);
      var siteTags = [];
      siteTagIds = ids;
      ids.forEach(function (id, pos) {
        redis.hgetall(dbname + '.tag.' + id, function (err, tag) {
          if (err) return next(err);
          siteTags.push(tag);
          if (pos === ids.length - 1) {
            proxy.trigger('siteTags', siteTags);
          }
        });
      });
    });

    redis.sdiff('sites.tags', dbname + '.tags', function (err, tagIds) {
      if (err) return next(err);
      var tags = [];
      tagIds.forEach(function (id, pos) {
        redis.hgetall('sites.tag.' + id, function (err, tag) {
          if (err) return next(err);
          tags.push(tag);
          if (pos === tagIds.length - 1) {
            proxy.trigger('tags', tags);
          }
        });
      });
    });
  });

  Site.findOne({domain: req.params.domain}, function (err, site) {
    if (err) return next(err);
    proxy.trigger('site', site);
  });

};
