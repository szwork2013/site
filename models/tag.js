/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
  name: {type: String, unique: true, required: true, trim: true},
  url: {type: String, unique: true, required: true, trim: true, lowercase: true},
  external: {type: String}
});

exports.Tag = mongoose.model('Tag', TagSchema);

