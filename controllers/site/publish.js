/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../../models');
var Site = models.Site;

exports.index = function (req, res, next) {
  Site.findOne({domain: req.params.domain}, function (err, site) {
    res.render('site/publish', {site: site, title: site.name});
  });
};