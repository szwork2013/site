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
var redis = require('redis').createClient();
redis.on("error", function (err) {
  console.log("connect to redis server " + redis.host + ":" + redis.port + " failed - " + err);
  process.exit(1);
});

exports.redis = redis;
exports.Site = require('./site').Site;
exports.Type = require('./type').Type;
exports.Tag = require('./tag').Tag;
exports.domain = require('./domain');
exports.pool = require('./pool');
exports.cache = require('./cache');
