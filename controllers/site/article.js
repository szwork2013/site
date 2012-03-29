/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../../models');
var Site = models.Site;
var domain = models.domain;
var pool = models.pool;
var combo = require('combo').combo;

exports.index = function (req, res, next) {
  var cb = combo(function (err, site) {
    res.render('site/article', {site: site, title: site.title});
  });

  Site.findOne({domain: req.params.domain}, cb.add());
}