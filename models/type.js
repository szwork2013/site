/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TypeSchema = new Schema({
  name: {type: String, required: true, trim: true},
  site: {type: [ObjectId]}
});

TypeSchema.statics.list = function(cb){
  this.find({}, function(err, types){
    if (err) throw cb(err, null);
    _types = {};
    types.forEach(function(type){
      _types[type._id] = type;
    });

    cb(null, _types);
  });
};

exports.Type = mongoose.model('Type', TypeSchema);
