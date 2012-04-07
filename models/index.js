/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var config = require('../config').config;

mongoose.connect(config.db, function (err) {
  if (err) {
    console.log('connect to db error: ' + err.message);
    process.exit(1);
  }
});

exports.Site = require('./site').Site;
exports.Type = require('./type').Type;
exports.Tag = require('./tag').Tag;
exports.Draft = require('./draft').Draft;
exports.domain = require('./domain');
exports.pool = require('./pool');