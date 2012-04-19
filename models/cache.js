/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../models');
var redis = models.redis;

exports.del = function (key, cb) {
  redis.del(key, function(err, result){
    cb(err, result);
  });
}

exports.getAid = function (dbname, cb) {
  var key = dbname + '.id';

  redis.setnx(key, 1000, function (err, result) {
    if (err) return cb(err);
    if (result === 1) {
      cb(null, 1000);
    } else {
      redis.incr(key, function (err, id) {
        cb(err, id);
      });
    }
  });
};

exports.cacheTag = function (dbname, tag, cb) {
  var key = dbname + '.tag.' + tag.id;
  var hash = {};
  hash.name = tag.name;
  hash.title = tag.title || '';
  hash.url = tag.url;
  hash.keyword = tag.keyword || '';
  hash.description = tag.description || '';
  hash.external = tag.external || '';
  redis.hmset(key, hash, function (err, result) {
    if (err) return cb(err);

    redis.sadd(dbname + '.tags', tag.id, function(err, result){
      cb(err, result);
    });
  });
};

exports.pushToCategory = function (dbname, category, aid, cb) {
  var key = dbname + '.category.' + category + '.articles';

  redis.lpush(key, aid, function (err, result) {
    cb(err, result);
  });
};

exports.pushToTag = function (dbname, tag, aid, cb) {
  var key = dbname + '.tag.' + tag + '.articles';

  redis.lpush(key, aid, function (err, result) {
    cb(err, result);
  });
};

exports.pushToSite = function (dbname, aid, cb) {
  redis.lpush(dbname + '.articles', aid, function (err, result) {
    cb(err, result);
  });
};
