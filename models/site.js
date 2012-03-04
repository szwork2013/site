/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var Schema = require('mongoose').Schema;

var SiteSchema = new Schema({
  name: {type: String},
 	domain: {type: String, index:true},
  path: {type: String},
 	ip: {type: String}
});

mongoose.model('Site', SiteSchema);
