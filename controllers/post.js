/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../models');
var Site = models.Site;
var domain = models.domain;
var pool = models.pool;

exports.index = function (req, res, next) {
  if (req.method === 'GET') {
    res.send('Not found', 404);
  } else if (req.method === 'POST') {
    Site.findOne({domain: domain}, function (err, site) {

    });

    var dbname = req.params.domain.replace(/\./g, '');
    var conn = pool(dbname);
    var Draft = conn.model('Draft', domain.DraftSchema);

    var draft = new Draft();
    draft.name = req.body.name;
    draft.keyword = req.body.keyword;
    draft.description = req.body.description;
    draft.category = req.body.category;
    draft.content = req.body.content;

    draft.save(function (err) {
      if (err) return res.send(err, 500);
      res.send('ok');
    });
  }
}