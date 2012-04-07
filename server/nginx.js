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

exports.action = function (action, cb) {
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
      cb(stdout + stderr);
    }
  });
};

exports.status = function () {
  return path.existsSync(config.nginx.pid) ? fs.statSync(config.nginx.pid).ctime : null;
};

exports.conf = function (site, cb) {

  return cb(null);
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

exports.killall = function (cb) {
  var nginx = spawn('killall', ['nginx']);
  nginx.on('exit', function (code) {
    if (code === 0) {
      cb(null);
    } else {
      cb(new Error('强制重启nginx服务器失败!'));
    }
  });
};
