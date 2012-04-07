/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DraftSchema = new Schema({
  title: {type: String, required: true, trim: true},
  keyword: {type: String},
  description: {type: String},
  domain: {type: String, index: true},
  category: {type: ObjectId, required: true},
  content: {type: String, required: true},
  dateline: {type: Date, 'default': Date.now},
  from: {type: String},
  random: {type: Boolean, index: true, 'default': Math.random}
});

exports.Draft = mongoose.model('Draft', DraftSchema);