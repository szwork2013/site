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
  } else if (req.method === 'POST'){
    var type = new Type(req.body);
    type.save(function (err) {
      if (err) return res.message('添加失败: ' + err, 0);
      res.redirect('/type');
    });
  } else if (req.method === 'PUT') {
    if (req.body.id) {
      Type.findById(req.body.id, function (err, type) {
        type.name = req.body.name;
        type.save(function (err) {
          if (err) return res.message('修改失败: ' + err, 0);
          res.redirect('/type');
        });
      });
    }
  } else if (req.method === 'DELETE') {
    Type.findById(req.body.id, function (err, type) {
      if (err || !type) {
        res.message('类别不存在，删除失败！', 0);
        return;
      }

      type.remove(function (err) {
        if (err) {
          res.message('类别删除失败：' + err.message, 0);
          return;
        }

        res.message('类别删除成功。');
      });
    });
  }
};
