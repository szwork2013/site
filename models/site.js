/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var SiteSchema = new Schema({
  name: {type: String, required: true, trim: true},
  domain: {type: String, unique: true, required: true, index: true, lowercase: true, trim: true},
  path: {type: String, unique: true, required: true, lowercase: true, trim: true},
  ip: {type: String},
  type: {type: ObjectId, required: true},
  keyword: {type: String},
  description: {type: String},
  urltype: {type: String, 'default': 'id', enum: ['id', 'py', 'abbr', 'cn']},
  template: {type: String, 'default': 'default'},
  advertment: {type: String},
  founded: {type: String, 'default': function () {
    var now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  }},
  counter: {draft: {type: Number, 'default': 0}, release: {type: Number, 'default': 0}},
  publish: {time: {type: Number, min: 0, max: 59, 'default': 0}, count: {type: Number, 'default': 0}}
});

SiteSchema.path('domain').validate(function (value) {
  return value.indexOf('http://') === -1;
}, 'invalidDomain');

exports.Site = mongoose.model('Site', SiteSchema);
