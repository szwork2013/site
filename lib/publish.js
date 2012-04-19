/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../models');
var domain = models.domain;
var cache = models.cache;
var Text = require('./text').Text;
var Tags = require('./tags').Tags;

exports.article = function (draft, tags, cb) {
  var Article = draft.db.model('Article', domain.ArticleSchema);

  var article = new Article();
  article.title = draft.title;
  article.category = draft.category;
  article.keyword = draft.keyword;
  article.description = draft.description;
  var tag = Tags.analyse(draft.title, tags);
  article.tag = tag;
  article.recommend = tag.length > 2 ? 1 : 0;
  article.outurl = tag.length ? tag[0].external : '';
  article.content = draft.content;

  cache.getAid(draft.db.name, function (err, id) {
    if (err) return cb(err);

    article.url = id;
    article.save(function (err) {
      if (err) return cb(err);

      cb(null, article);
    });
  });
};

exports.content = function (article, tags, cb) {
  var Content = article.db.model('Article', domain.ContentSchema);

  var normal = Tags.replace(article.content, tags);
  var content = new Content();
  content.original = article.content;
  content.normal = normal;
  content.shuffle = Text.shuffle(normal);
  content.save(function (err) {
    if (err) return cb(err);
    cb(null, content);
  });
};

exports.tag = function (tag, db, cb) {
  var sTag = db.model('sTag', domain.TagSchema);
  var stag = new sTag();
  stag._id = tag.id;
  stag.name = tag.name;
  stag.url = tag.url;
  stag.external = tag.external;
  stag.save(function (err) {
    if (err) return cb(err);
    cb(null, content);
  });
};






