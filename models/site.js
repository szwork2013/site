/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var util = require('util');

var SiteSchema = new Schema({
  name: {type: String, required: true, trim: true},
  domain: {type: String, required: true, index: true, lowercase: true, trim: true},
  path: {type: String, required: true, lowercase: true, trim: true},
  ip: {type: String},
  type: {type: ObjectId, required: true},
  keyword: {type: String},
  description: {type: String},
  urltype: {type: String, default: 'id', enum: ['id', 'py', 'abbr', 'cn']},
  template: {type: String, default: 'default'},
  advertment: {type: String},
  founded: {type: Date, default: Date.now}
});

SiteSchema.path('domain').validate(function (value) {
  return value.indexOf('http://')  === -1;
}, 'invalidDomain');

SiteSchema.methods.typeLink = function () {
  return util.format('<a href="%s">%s</a>', '/site/type', this.name);
};

exports.Site = mongoose.model('Site', SiteSchema);
