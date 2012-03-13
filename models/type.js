/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Site = require('../models').Site;

var TypeSchema = new Schema({
  name: {type: String, required: true, trim: true},
  site: {type: [ObjectId]}
});

TypeSchema.statics.list = function (cb) {
  this.find({}, function (err, types) {
    if (err) return cb(err, null);
    _types = {};
    types.forEach(function (type) {
      _types[type._id] = type;
    });

    cb(null, types, _types);
  });
};

TypeSchema.statics.sitesByType = function (cb) {
  this.find({}, function (err, types) {
    if (err) return cb(err, null);

    var sitesByType = {};
    var i = types.length;
    types.forEach(function (type) {
      Site.find({type: type._id}, ['name'], function (err, sites) {
        if (err) return cb(err, null);

        sitesByType[type._id] = sites;
        if (--i === 0) return cb(null, sitesByType);
      });
    });
  });
};

exports.Type = mongoose.model('Type', TypeSchema);
