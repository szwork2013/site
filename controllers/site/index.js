/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

/**
 * site home
 */
exports.home = require('./home').index;

/**
 * site article
 */
exports.article = require('./article').index;

/**
 * site draft
 */
exports.draft = require('./draft').index;

/**
 * site category
 */
exports.category = require('./category').index;

/**
 * site tag
 */
exports.tag = require('./tag').index;

/**
 * site publish
 */
exports.publish = require('./publish').index;

/**
 * site setting
 */
exports.setting = require('./setting').index;