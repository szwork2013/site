/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

exports.ArticleSchema = new Schema({
  title: {type: String, unique: true, required: true, trim: true},
  url: {type: String, unique: true, required: true, trim: true},
  keyword: {type: String},
  description: {type: String},
  tag: {type: [ObjectId]},
  dateline: {type: Date, 'default': Date.now},
  category: {type: ObjectId, required: true},
  views: {type: Number, 'default': 0},
  recommend: {type: Boolean, 'default': false},
  outurl: {type: String}
});

var CategorySchema = new Schema({
  name: {type: String, required: true, trim: true},
  title: {type: String, required: true, trim: true},
  keyword: {type: String},
  description: {type: String},
  url: {type: String, unique: true, required: true, trim: true},
  tag: {type: [ObjectId]},
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

exports.TagSchema = new Schema({
  name: {type: String, required: true, trim: true},
  url: {type: String, unique: true, required: true, trim: true},
  keyword: {type: String},
  description: {type: String},
  article: {type: [ObjectId]},
  external: {type: String}
});

exports.ContentSchema = new Schema({
  origin: {type: String, required: true},
  shuffle: {type: String, required: true}
});

