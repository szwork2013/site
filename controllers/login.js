/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var util = require('util');
var config = require('../config').config;

exports.index = function (req, res) {
  if (req.method === 'GET') {
    res.render('login');
  } else {
    var username = req.body.username;
    var password = req.body.password;

    if (username === config.admin.username && password === config.admin.password) {
      req.session.user = username;
      res.redirect('/site');
    } else {
      res.redirect('/login');
    }
  }
};
