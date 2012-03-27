/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var domain = require('./domain');

module.exports = function () {
  var connections = {};

  return function (dbname) {
    if (!connections[dbname]) {
      connections[dbname] = mongoose.createConnection('mongodb://127.0.0.1/' + dbname);
    }

    return connections[dbname];
  };
}();