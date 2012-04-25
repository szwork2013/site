/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var redis = require('redis').createClient();

redis.smembers('sites.tags', function (err, tags) {

  console.time('load2');
  var len = tags.length;
  var t = [];
  tags.forEach(function (id) {
    redis.hgetall('sites.tag.' + id, function (err, tag) {
      if (err) return next(err);
      t.push(tag);
      if (--len === 0) {
        console.log(t.length);
        console.timeEnd('load2');
      }
    });
  });
});

