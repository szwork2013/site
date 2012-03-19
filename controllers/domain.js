/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var mongoose = require('mongoose');
var models = require('../models');
var Domain = models.Domain;
var Site = models.Site;
var combo = require('combo').combo;

var connectionPool = {};

exports.index = function (req, res, next) {
/*
  var dbname = 'testsite';
  var conn;

  if (connectionPool[dbname]) {
    conn = connectionPool[dbname];
  } else {
    conn = mongoose.createConnection('mongodb://127.0.0.1/' + dbname);
  }

  var Article = conn.model('Article', Model.ArticleSchema);
  var Category = conn.model('Category', Model.CategorySchema);
  var Content = conn.model('Content', Model.ContentSchema);
*/
  Site.findOne({domain: req.params.domain}, function(err, site){
    if (err) return next(err);

    res.render('domain/index', {site: site, title: site.name});
  });
};

exports.tag = function (req, res, next){
  //var Tag = conn.model('Tag', Model.TagSchema);

  /*
  var tag = new Tag();
  tag.name = '人流';
  tag.url = '/tag/renliu';
  tag.keyword = '人流关键词';
  tag.description = '人流描述';
  tag.external = 'http://www.qq.com/';

  tag.save(function(err){
    if (err) return next(err);

    res.send(tag);
  });
  */

  res.render('domain/tag');
};

exports.category = function(req, res, next){

  var dbname = req.params.domain.replace(/\./g, '');
  var conn;

  if (connectionPool[dbname]) {
    conn = connectionPool[dbname];
  } else {
    conn = mongoose.createConnection('mongodb://127.0.0.1/' + dbname);
    connectionPool[dbname] = conn;
  }

  if (req.method === 'GET'){

    var cb = combo(function(site, categories){
      if (site[0] || categories[0]) return next(site[0] || categories[0]);

      var site = site[1];
      var
      res.render('domain/category', {site: site[1], categories: categories[1]});
    });

    Site.findOne({domain: req.params.domain}, cb.add());

    var Category = conn.model('Category', Domain.CategorySchema);
    Category.find({}, cb.add());

  } else if (req.method === 'POST') {

    Site.findOne({domain: req.params.domain}, function(err, site){
      if (err) return next(err);

      var Category = conn.model('Category', Domain.CategorySchema);

      var category = new Category(req.body);
      category.save(function(err){
        if (err) return next(err);

        res.render('domain/category', {site: site, title: site.name});
      });
    });

  } else if (req.method === 'PUT') {

  } else if (req.method === 'DELETE') {
    console.log('delete');
  }
};