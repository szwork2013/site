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

exports.cacheTag = function (tag, cb) {
  var dbname = tag.db.name;
  var hash = {};
  hash.id = tag._id;
  hash.name = tag.name;
  hash.url = tag.url;
  hash.external = tag.external || '';
  if (dbname !== 'sites') {
    hash.title = tag.title || '';
    hash.keyword = tag.keyword || '';
    hash.description = tag.description || '';
  }

  redis.hmset(dbname + '.tag.' + tag._id, hash, function (err, result) {
    if (err) return cb(err);
    redis.sadd(dbname + '.tags', tag._id, function(err, result){
      cb(err, result);
    });
  });
};

exports.deleteTag = function (tag, cb) {
  var dbname = tag.db.name;
  redis.srem(dbname + '.tags', tag._id, function (err, result){
    if (err) return cb(err);
    redis.del(dbname + '.tag.' + tag._id, function (err, result){
      if (err) return cb(err);
      cb(null, result);
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
