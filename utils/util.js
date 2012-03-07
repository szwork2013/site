/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var util = require('util');

exports.formatDate = function(date, verbose){
  var year = date.getFullYear();
 	var month = date.getMonth()+1;
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
