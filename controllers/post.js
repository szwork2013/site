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
      if (err) return res.send('100');
      if (site === null) {
        res.send('101');
      }
    });

    if (!req.body.title) {
      res.send('102');
    }

    if (!req.body.category) {
      res.send('103');
    }

    if (!req.body.content) {
      res.send('104');
    }

    var dbname = req.params.domain.replace(/\./g, '');
    var conn = pool(dbname);
    var Draft = conn.model('Draft', domain.DraftSchema);

    var draft = new Draft();
    draft.title = req.body.title;
    draft.keyword = req.body.keyword;
    draft.description = req.body.description;
    draft.category = req.body.category;
    draft.content = req.body.content;

    draft.save(function (err) {
      if (err) return res.send(err, 500);
      res.send('1');
    });
  }
}