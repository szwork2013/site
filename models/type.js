/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Site = require('./site');

var TypeSchema = new Schema({
  name: {type: String, required: true, trim: true},
  site: {type: [ObjectId]}
});

TypeSchema.methods.getSites = function(cb) {
  return Site.find({type: this._id}, cb);
};

TypeSchema.statics.list = function (cb){
  this.where().run(function(err, types){
    if (err) cb(err, null);

    var _types = {};
    types.forEach(function(type){
      _types[type._id] = type;
    });
    cb(null, _types);
  });
};

exports.Type = mongoose.model('Type', TypeSchema);
