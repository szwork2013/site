/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var util = require('util');

exports.index = function (req, res) {
  var method = req.method.toLowerCase();
  if (method === 'get') {
    req.session.auth = 'asdad';
    res.render('login');
  }
  else {
    res.send(util.inspect(req.session.auth));
  }
};
