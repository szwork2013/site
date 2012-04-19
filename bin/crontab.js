/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var models = require('../models');
var Site = models.Site;
var domain = models.domain;
var Text = require('../lib/text').Text;
var Tags = require('../lib/tags').Tags;
var util = require('../lib/util');
var EventProxy = require('eventproxy').EventProxy;
var redis = require('redis').createClient();

var tags;



setInterval(function () {
  Site.find({domain: 'www.cdangel.com'}, function (err, sites) {

    var cron = EventProxy.create();
    cron.after('complete', sites.length, function () {
      console.log('complete');
    });

    sites.forEach(function(site){
      var dbname = site.domain.replace(/\./g, '');
      var db = mongoose.createConnection('mongodb://127.0.0.1/' + dbname);
      var Draft = db.model('Draft', domain.DraftSchema);
      var Article = db.model('Article', domain.ArticleSchema);
      var Tag = db.model('Tag', domain.TagSchema);
      var Content = db.model('Content', domain.ContentSchema);

      Draft.rfind(site.publish.count, function (err, drafts) {
        var total = drafts.length;
        var proxy = EventProxy.create();
        proxy.after('publish', total, function () {
          cron.trigger('complete');
        });

        for (var i = 0; i < total; i++) {
          var ep = EventProxy.create();
          ep.assign('tag', 'content', (function(){
            var draft = drafts[i];
            return function (tag, body) {
              var article = new Article();
              article.title = draft.title;
              article.url = Math.round(Math.random() * 10000);
              article.category = draft.category;
              article.keyword = draft.keyword;
              article.description = draft.description;
              article.tag = tag;
              article.recommend = tag.length >= 2 ? 1 : 0;
              article.save(function(err){
                if (err) throw err;

                var cache = EventProxy.create();
                cache.assign('article', 'category', 'list', function () {
                  console.log(article.title + '缓存完成');
                });

                var articleCache = {id: article._id, title: article.title, category: article.category, dateline: article.dateline, url: article.url, views: Math.round(Math.random() * 1000), keyword: article.keyword, description: article.description};
                redis.hmset(dbname + '.a.' + articleCache.id, articleCache, function (err, result) {
                  if (err) throw err;
                  cache.trigger('article')
                });

                redis.lpush(dbname + '.c.' + article.category + '.articles', article._id, function (err, result) {
                  if (err) throw err;
                  cache.trigger('category');
                });

                redis.lpush(dbname + '.a', article._id, function (err, result) {
                  if (err) throw err;
                  cache.trigger('list');
                });

                var content = new Content();
                content._id = article._id;
                content.origin = draft.content;
                content.normal = body;
                content.shuffle = Text.shuffle(body);
                content.save(function(err){
                  if (err) {
                    article.remove(function(err){
                      console.log('文章内容发布失败,删除该文章发生错误' + err);
                      proxy.trigger('publish');
                    });
                  } else {
                    console.log(article.title + '发布成功');
                    proxy.trigger('publish');
                  }
                });

                //var tag = new Tag();
              });
            };
          })());

          Tags.analyse(drafts[i].title, function (err, tag) {
            if (err) throw err;
            ep.trigger('tag', tag);
          });

          Tags.replace(drafts[i].content, function (err, content) {
            if (err) throw err;
            ep.trigger('content', content);
          });
        }
      });
    });
  });
}, 10000);

process.on('uncaughtException', function (err) {
  console.log('系统错误' + err);
});
