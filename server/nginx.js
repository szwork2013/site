/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var ejs = require('ejs');
var config = require('../config.js').config;

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

exports.conf = function (site, cb) {

  var webpath = path.join(config.wwwroot, site.path);
  var logpath = path.join(config.logpath, site.domain) + '.log';
  var confpath = path.join(config.nginx.conf, site.domain) + '.conf';

  var confstr = fs.readFileSync(__dirname + '/site.conf', 'utf8');
  confstr = ejs.render(confstr, {domain: site.domain, webpath: webpath, logpath: logpath});

  fs.writeFile(confpath, confstr, 'utf8', function (err) {
    if (err) return cb(err);

    cb(null);
  });

};
