/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var util = require('util');
var models = require('../models');
var Site = models.Site;
var Type = models.Type;

exports.index = function (req, res) {
  res.render('site/index');
};

exports.add = function (req, res) {
  if (req.method === 'POST') {
    res.send(util.inspect(new Site()));
  } else {
    res.render('site/add');
  }
};

exports.list = function (req, res) {
  res.render('site/list');
};

exports.type = function (req, res) {

/*
  ['妇科', '男科', '皮肤病'].forEach(function (name) {
    var type = new Type();
    type.name = name;
    type.save();
  });
*/
  var type = new Type();
  type.name = '123';
  type.save(function(){
    res.send('OK');
  });
}
