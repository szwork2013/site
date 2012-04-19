/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var models = require('../models');
var Site = models.Site;
var Tag = models.Tag;
var domain = models.domain;
var publish = require('../lib/publish');
var EventProxy = require('eventproxy').EventProxy;
var Redis = models.Redis;

var proxy = EventProxy.create();
proxy.assign();

var tags;
Tag.find(function(err, tags){
  if (err) {
    console.warn('Load global tags error: ' + err);
    process.exit(1);
  }

  console.log(this);
  tags = tags;
});

setInterval(function(){
  console.log(tags.length);
}, 1000);
/*
Site.findOne({domain: 'www.cdangel.com'}, function (err, site) {
  if (err) throw err;

  setInterval(function () {
    publish(site);
  }, 5000);
});

var publish = function (site) {

  var dbname = site.domain.replace(/\./g, '');
  var db = mongoose.createConnection('mongodb://127.0.0.1/' + dbname);
  var Draft = db.model('Draft', domain.DraftSchema);

  Draft.rfind(site.publish.count, function (err, drafts) {
    if (err) throw err;

    drafts.forEach(function (draft) {
      console.log(draft.title);
      checkOut(draft);
    });
  });
};

var checkOut = function (draft) {
  var db = draft.db;
  var Tag = db.model('Tag', domain.TagSchema);
  var Article = db.model('Article', domain.ArticleSchema);
  var Content = db.model('Content', domain.ContentSchema);

  var proxy = EventProxy.create();
  proxy.assign('aid', 'tag', 'body', function (aid, tag, body) {

    var article = new Article();
    article.title = draft.title;
    article.url = aid;
    article.category = draft.category;
    article.keyword = draft.keyword;
    article.description = draft.description;
    article.tag = tag;
    article.recommend = tag.length >= 2 ? 1 : 0;

    article.save(function (err) {
      if (err) {

      }

      var content = new Content();
      content.original = draft.content;
      content.normal = body;
      content.shuffle = Text.shuffle(body);
      content.save(function (err) {
        if (err) {
          article.remove(function (err) {
            console.log('文章内容发布失败,删除该文章发生错误' + err);
            proxy.trigger('publish');
          });
        } else {
          //
        }
      });
    });
  });

  Redis.aid(db.name, function (err, aid) {
    if (err) throw err;
    proxy.trigger('aid', aid);
  });

  Tags.analyse(draft.title, function (err, tag) {
    if (err) throw err;
    proxy.trigger('tag', tag);
  });

  Tags.replace(draft.content, function (err, body) {
    if (err) throw err;
    proxy.trigger('body', body);
  });
};
  */