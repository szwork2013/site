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
  outurl: {type: String}
});

var CategorySchema = new Schema({
  name: {type: String, required: true, trim: true},
  title: {type: String, required: true, trim: true},
  keyword: {type: String},
  description: {type: String},
  url: {type: String, unique: true, required: true, trim: true},
  template: {type: String},
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
  name: {type: String, required: true, trim: true},
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
  origin: {type: String, required: true},
  normal: {type: String, required: true},
  shuffle: {type: String, required: true}
});

