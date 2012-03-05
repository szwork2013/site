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
exports.Type = require('./site').Type;
