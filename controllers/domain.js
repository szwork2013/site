/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var Model = require('../models/domain');

exports.index = function (req, res, next) {

  var dbname = 'keshirenliu';

  var conn = mongoose.createConnection('mongodb://127.0.0.1/' + dbname);

  var Article = conn.model('Article', Model.ArticleSchema);
  var Category = conn.model('Category', Model.CategorySchema);
  var Tag = conn.model('Tag', Model.TagSchema);
  var Content = conn.model('Content', Model.ContentSchema);

  Article.find({}, function(err, docs){
    if (err) next(err);

    console.log(docs);
  });

  Article.count({}, function(err, count){
    if (err) next(err);
    res.send(count);
  });

};
