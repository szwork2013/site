/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var home = require('../controllers/home');
exports.index = home.index;

var site = require('../controllers/site');
exports.site = site.index;

var login = require('../controllers/login');
exports.login = login.index;

var tag = require('../controllers/tag');
exports.tag = tag.index;
