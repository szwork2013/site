/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var Tag = require('../models').Tag;

exports.index = function (req, res, next) {

  if (req.method === 'GET') {
    Tag.find({}, function(err, types){
      if (err) return next(err);

      res.render('tag', {types: types});
    });
  } else if (req.method === 'POST') {
    var tag = new Tag(req.body);
    tag.save(function (err) {
      if (err) {
        res.message('标签添加失败。' + err, 0);
      } else {
        res.message('标签添加成功。');
      }
    });
  } else if (req.method === 'PUT') {
    var id = req.body.id;
    Tag.findById(id, function (err, tag) {
      if (err) return res.message('标签不存在！');

      tag.name = req.body.name;
      tag.url = req.body.url;
      tag.external = req.body.external;
      tag.save(function(err){
        if (err) {
          res.message('标签修改失败！' + err, 0);
        } else {
          res.message('标签修改成功。');
        }
      });
    });
  } else if (req.method === 'DELETE') {
    var id = req.body.id;
    Tag.findById(id, function (err, tag) {
      if (err) return res.message('标签不存在！');

      tag.remove(function(err){
        if (err) {
          res.message('标签删除失败！', 0);
        } else {
          res.message('标签删除成功。');
        }
      });
    });
  }
};