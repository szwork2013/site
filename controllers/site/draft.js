/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../../models');
var Site = models.Site;
var Draft = models.Draft;
var combo = require('combo').combo;

exports.index = function (req, res, next) {
  if (req.method === 'GET') {
    var domain = req.params.domain;
    var cb = combo(function(err, site, drafts, count){
      if (err) return next(err);
      res.render('site/draft', {site: site, title: site.name, drafts: drafts, count: count});
    });

    Site.findOne({domain: domain}, cb.add());
    Draft.find({domain: domain}).limit(20).run(cb.add());
    Draft.count({domain: domain}, cb.add());
  }
};