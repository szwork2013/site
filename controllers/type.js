/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var models = require('../models');
var Type = models.Type;

exports.index = function (req, res, next) {
  if (req.method === 'GET') {
    Type.find({}, function (err, types) {
      res.render('type', {types: types});
    });
  } else if (req.method === 'POST') {
    var type = new Type();
    if (req.body.id) {
      Type.findById(req.body.id, function (err, type) {
        type.name = req.body.name;
        type.save(function (err) {
          if (err) return next(err);
          res.redirect('/type');
        });
      });
    }
  } else if (req.method === 'DELETE') {
    Type.findById(req.params.id, function (err, type) {
      if (err || !type) {
        res.send({ok: 0, message: '类别不存在，删除失败！'});
        return;
      }

      type.remove(function (err) {
        if (err) {
          res.send({ok: 0, message: '类别删除失败：' + err.message});
          return;
        }

        res.send({ok: 1, message: '删除成功。'});
      });
    });
  }
};
