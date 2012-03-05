/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteSchema = new Schema({
  name: {type: String, required: true},
  domain: {type: String, required: true, index: true, lowercase: true, trim: true},
  path: {type: String, required: true, lowercase: true, trim: true},
  ip: String,
  type: {type: Number, required: true},
  keyword: String,
  description: String,
  urltype: String,
  template: String,
  advertment: String,
  founded: String
});

exports.Site = mongoose.model('Site', SiteSchema);
