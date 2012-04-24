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
  article.keyword = draft.keyword ? draft.keyword : draft.title;
  article.description = draft.description;
  var _tags = Tags.analyse(draft.title, tags);
  article.tags = _tags.map(function (tag) {
    return tag.id;
  });
  article.recommend = _tags.length > 2 ? 1 : 0;
  article.outurl = _tags.length ? _tags[0].external : '';

  cache.getAid(draft.db.name, function (err, id) {
    if (err) return cb(err);

    article.url = id;
    article.save(function (err) {
      if (err) return cb(err);
      cb(null, article, draft.content);
    });
  });
};

exports.content = function (article, body, tags, cb) {
  var Content = article.db.model('Content', domain.ContentSchema);
  var content = new Content();
  content._id = article._id;
  content.original = body;

  var normal = Tags.replace(body, Tags.analyse(body, tags));
  content.normal = normal;
  content.shuffle = Text.shuffle(normal);
  content.save(function (err) {
    if (err) return cb(err);
    cb(null, content);
  });
};

exports.tag = function (tag, cb) {
  var sTag = tag.db.model('sTag', domain.TagSchema);
  var stag = new sTag();
  stag._id = tag.id;
  stag.name = tag.name;
  stag.url = tag.url;
  stag.external = tag.external;
  stag.save(function (err) {
    if (err) return cb(err);
    cb(null, stag);
  });
};






