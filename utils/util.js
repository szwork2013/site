/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var util = require('util');

exports.formatDate = function (date, verbose) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var date = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

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
  return (bytes / Math.pow(1024, power)) + units[power];
};
