/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var Schema = require('mongoose').Schema;
var ObjectId = Schema.ObjectId;

exports.ArticleSchema = new Schema({
  title: {type: String, unique: true, required: true, trim: true},
  url: {type: String, unique: true, required: true, trim: true},
  tag: {type: [ObjectId], index: true},
  category: {type: ObjectId, index: true, required: true},
  keyword: {type: String},
  description: {type: String},
  dateline: {type: Date, 'default': Date.now},
  views: {type: Number, 'default': 0},
  recommend: {type: Number, 'default': 0},
  outurl: {type: String},
  inbaidu: {type: Number, 'default': 0}
});

var CategorySchema = new Schema({
  name: {type: String, required: true, trim: true},
  title: {type: String, required: true, trim: true},
  keyword: {type: String},
  description: {type: String},
  url: {type: String, unique: true, required: true, trim: true},
  count: {type: Number, 'default': 0},
  listtpl: {type: String, 'default': 'list.html'},
  showtpl: {type: String, 'default': 'show.html'},
  advertment: {type: String}
});

CategorySchema.statics.list = function (cb) {
  this.find({}, function (err, data) {
    if (err) return cb(err, null);

    var categories = {};
    data.forEach(function (category) {
      categories[category._id] = category;
    });

    cb(null, data, categories);
  });
};

exports.CategorySchema = CategorySchema;

var TagSchema = new Schema({
  name: {type: String, unique: true, required: true, trim: true},
  title: {type: String, trim: true},
  url: {type: String, unique: true, required: true, trim: true},
  keyword: {type: String},
  description: {type: String},
  external: {type: String}
});

TagSchema.statics.list = function (cb) {
  this.find({}, function (err, data) {
    if (err) return cb(err, null);

    var tags = {};
    data.forEach(function (tag) {
      tags[tag._id] = tag;
    });

    cb(null, data, tags);
  });
};

exports.TagSchema = TagSchema;

exports.ContentSchema = new Schema({
  original: {type: String, required: true},
  normal: {type: String, required: true},
  shuffle: {type: String, required: true}
});

var DraftSchema = new Schema({
  title: {type: String, required: true, trim: true},
  keyword: {type: String},
  description: {type: String},
  category: {type: ObjectId, required: true},
  content: {type: String, required: true},
  dateline: {type: Date, 'default': Date.now},
  from: {type: String, 'default': 'N/A'},
  random: {type: Number, index: true, 'default': Math.random}
});

DraftSchema.statics.rfind = function (count, cb) {
  var random = Math.random();
  var self = this;
  this.find({random: {$gt: random}}).limit(count).run(function (err, drafts) {
    if (err) return cb(err);
    if (drafts.length) {
      cb(null, drafts);
    } else {
      self.find({random: {$lt: random}}).limit(count).run(function (err, drafts) {
        if (err) return cb(err);
        cb(null, drafts);
      });
    }
  });
};

exports.DraftSchema = DraftSchema;
