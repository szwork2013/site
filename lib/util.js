/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var util = require('util');

exports.formatDate = function (dateObj, verbose) {
  var year = dateObj.getFullYear();
  var month = dateObj.getMonth() + 1;
  var date = dateObj.getDate();
  var hour = dateObj.getHours();
  var minute = dateObj.getMinutes();
  var second = dateObj.getSeconds();

  if (verbose) {
    return util.format('%s-%s-%s %s:%s:%s', year, month, date, hour, minute, second);
  } else {
    return util.format('%s-%s-%s', year, month, date);
  }
};

exports.timeOffset = function (time) {
  var result = '';
  if (time >= 86400) {
    result = Math.floor(time / 86400) + '天';
    time = Math.floor(time % 86400);
  }

  if (time >= 3600) {
    result += Math.floor(time / 3600) + '小时';
    time = Math.floor(time % 3600);
  }

  if (time >= 60) {
    result += Math.floor(time / 60) + '分钟';
    time = Math.floor(time % 60);
  }

  result += time + '秒';

  return result;
};

exports.bytes = function (bytes) {
  var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
  var power = (bytes > 0) ? Math.floor(Math.log(bytes) / Math.log(1024)) : 0;
  return Math.floor(bytes / Math.pow(1024, power)) + units[power];
};

exports.url = function (domain, path) {
  domain =  ~domain.indexOf('http://') ? domain : 'http://' + domain;
  path = ~path.indexOf('/') ? path : '/' + path;

  return domain + path;
};

exports.message = function () {
  return function (req, res, next) {
    res.message = function message(message, status, url) {
      status = status == null ? 1 : status;
      message = message || '操作已成功。';
      url = url || req.url;

      this.render('message', {status: status, message: message, url: url});
    };

    return next();
  };
};

exports.pass = function (data, cb) {
  process.nextTick(function () {
    cb(null, data);
  });
};