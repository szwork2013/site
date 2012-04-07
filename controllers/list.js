/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../models');
var Site = models.Site;
var Type = models.Type;
var combo = require('combo').combo;

exports.index = function (req, res, next) {
  var curtype = req.params.type;
  var cb = combo(function (err, sites, types) {
    if (err) return next(err);
    res.render('list', {curtype: curtype, sites: sites, types: types[0], typeos: types[1]});
  });

  Site.find(curtype ? {type: curtype} : {}).desc('_id').run(cb.add());
  Type.list(cb.add());
};