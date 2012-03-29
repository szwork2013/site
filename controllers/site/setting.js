/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../../models');
var Site = models.Site;
var Type = models.Type;
var combo = require('combo').combo;
var nginx = require('../../server/nginx');

exports.index = function (req, res, next) {
  if (req.method === 'GET') {
    var cb = combo(function (err, site, types) {
      if (err) next(err);
      res.render('site/setting', {site: site, title: site.name, types: types});
    });

    Site.findOne({domain: req.params.domain}, cb.add());
    Type.find(cb.add());
  } else if (req.method === 'POST') {
    Site.findById(req.body.id, function (err, site) {
      if (err) return next(err);

      if (!site) {
        res.message('该网站不存在', 0);
      }

      var needUpdateNginx = false;
      var originDomain = site.domain;

      if (site.domain !== req.body.domain) {
        needUpdateNginx = true;
      }

      if (site.path !== req.body.path) {
        needUpdateNginx = true;
      }

      site.name = req.body.name;
      site.domain = req.body.domain;
      site.path = req.body.path;
      site.ip = req.body.ip;
      site.type = req.body.type;
      site.keyword = req.body.keyword;
      site.description = req.body.description;
      site.urltype = req.body.urltype;
      site.template = req.body.template;
      site.advertment = req.body.advertment;

      site.save(function (err) {
        if (err) return next(err);

        if (needUpdateNginx) {

          if (originDomain !== site.domain) {
            var confpath = path.join(config.nginx.conf, originDomain) + '.conf';
            if (path.existsSync(confpath)) {
              fs.unlinkSync(confpath);
            }
          }

          nginx.conf(site, function (err) {
            if (err) return next(err);

            var action = nginx.status() ? 'reload' : 'start';
            nginx.action(action, function (err) {
              if (err) {
                res.message('站点修改成功,更新nginx时发生错误' + err, 0);
              } else {
                res.message('站点修改成功');
              }
            });
          });
        } else {
          res.message('站点修改成功');
        }
      });
    });
  }
};