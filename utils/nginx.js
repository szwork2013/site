/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var config = require('../config').config;

exports.dos = function (action, cb) {
  if (action === 'start') {
    var nginx = spawn(config.nginx.sbin);
  } else {
    var nginx = spawn(config.nginx.sbin, ['-s', action]);
  }

  var stdout = '';
  var stderr = '';

  nginx.stdout.on('data', function (data) {
    stdout += data;
  });

  nginx.stderr.on('data', function (data) {
    stderr += data;
  });

  nginx.on('exit', function (code) {
    if (code === 0) {
      if (stdout || stderr) {
        cb(stdout + stderr);
      } else {
        cb(null);
      }
    } else {
      cb(stdout + stderr, null);
    }
  });
};

exports.status = function (cb) {
  if (path.existsSync(conf.pid)) {
    var stat = fs.statSync(conf.pid);
    cb(null, stat);
  } else {
    cb(new Error('server dose not running'));
  }
};
