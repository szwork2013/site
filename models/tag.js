/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TagSchema = new Schema({
  name: {type: String, required: true, trim: true},
  url: {type: String, unique: true, required: true, trim: true},
  keyword: {type: String},
  description: {type: String},
  external: {type: String}
});

exports.Tag = mongoose.model('Tag', TagSchema);

