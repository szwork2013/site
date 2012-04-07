/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../../models');
var Site = models.Site;
var Publish = models.Publish;
var combo = require('combo').combo;

exports.index = function (req, res, next) {
  if (req.method === 'GET') {
    Site.findOne({domain: req.params.domain}, ['name', 'domain', 'publish'], function (err, site) {
      res.render('site/publish', {site: site, title: site.name});
    });
  } else if (req.method === 'POST') {
    Site.findOne({domain: req.params.domain}, function (err, site) {
      site.publish.time = req.body.time;
      site.publish.count = req.body.count;
      site.save(function (err) {
        if (err) return res.message('发布配置修改失败' + err, 0);
        res.message('发布配置修改成功');
      });
    });
  }
};