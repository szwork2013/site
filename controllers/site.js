/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var util = require('util');

exports.index = function(req, res){
  res.render('site/index');
};

exports.add = function(req, res){
  if (req.method === 'POST') {
    res.send(util.inspect(req.body));
  } else {
    res.render('site/add');
  }
};

exports.list = function(req, res){
  res.render('site/list');
};
