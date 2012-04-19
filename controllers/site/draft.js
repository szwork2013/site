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
  if (req.method === 'GET') {
    var dbname = req.params.domain.replace(/\./g, '');
    var conn = pool(dbname);
    var Draft = conn.model('Draft', domain.DraftSchema);

    var cb = combo(function(err, site, drafts, count){
      if (err) return next(err);
      res.render('site/draft', {site: site, title: site.name, drafts: drafts, count: count});
    });

    Site.findOne({domain: req.params.domain}, cb.add());
    Draft.find({}).limit(20).run(cb.add());
    Draft.count(cb.add());
  }
};