/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var nginx = require('../server/nginx');
var os = require('os');
var config = require('../config').config;

exports.index = function (req, res) {
  var uptime = nginx.status() ? (Date.now() - nginx.status().getTime()) / 1000 : 0;
  res.render('server/index', {os: os, config: config, uptime: uptime});
};

exports.start = function (req, res) {
  nginx.action('start', function (err) {
    res.render('server/nginx', {action: 'start', err: err});
  });
};

exports.restart = function(req, res){
  nginx.action('reload', function(err){
    res.render('server/nginx', {action: 'reload', err: err});
  });
};

exports.killall = function (req, res) {
  nginx.killall(function (err) {
    res.render('server/nginx', {action: 'killall', err: err});
  });
};
