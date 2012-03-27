/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

/**
 * web index
 */
exports.home = require('../controllers/home').index;

/**
 * site
 */
exports.web = require('../controllers/web');

/**
 * type
 */
exports.type = require('../controllers/type').index;

/**
 * list
 */
exports.list = require('../controllers/list').index;

/**
 * login
 */
exports.login = require('../controllers/login').index;

/**
 * global tag
 */
exports.tag = require('../controllers/tag').index;

/**
 * server
 */
exports.server = require('../controllers/server');

/**
 * site
 */
exports.site = require('../controllers/site');
