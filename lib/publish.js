/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../models');
var domain = models.domain;
var cache = models.cache;
var Tag = models.Tag;
var Text = require('./text').Text;
var Tags = require('./tags').Tags;

exports.article = function (draft, tags, cb) {
  var Article = draft.db.model('Article', domain.ArticleSchema);

  var article = new Article();
  article.title = draft.title;
  article.category = draft.category;
  article.keyword = draft.keyword ? draft.keyword : draft.title;
  article.description = draft.description;
  var articleTags = Tags.analyse(draft.title, tags);
  article.tags = articleTags.map(function (tag) {
    return tag.id;
  });
  article.recommend = articleTags.length > 2 ? 1 : 0;
  article.outurl = articleTags.length ? articleTags[0].external : '';

  cache.getAid(draft.db.name, function (err, id) {
    if (err) return cb(err);

    article.url = id;
    article.save(function (err) {
      if (err) return cb(err);
      cb(null, article, draft.content, articleTags);
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

exports.tag = function (tag, db, cb) {
  var Tag = db.model('sTag', domain.TagSchema);
  var _tag = new Tag();
  _tag._id = tag.id;
  _tag.name = tag.name;
  _tag.url = tag.url;
  _tag.external = tag.external;
  _tag.title = tag.title || '';
  _tag.keyword = tag.keyword || '';
  _tag.description = tag.description || '';
  _tag.save(function (err) {
    if (err) return cb(err);
    cb(null, _tag);
  });
};






