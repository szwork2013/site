/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var Tag = require('./models').Tag;
var tags = [];

function Tags() {}

Tags.replace = function (text, tags, cb) {
  if (typeof tags === 'function') {
    cb = tags;
    tags = null;
  }

  if (tags === null) {
    Tags.analyse(text, function (err, tags) {
      if (err) return cb(err);
      cb(null, _tagReplace(text, tags));
    });
  } else {
    cb(null, _tagReplace(text, tags));
  }
};

Tags.analyse = function (text, count, cb) {
  if (typeof count === 'function') {
    cb = count;
    count = 5;
  }

  var results = [];
  Tags.data(function (err, tags) {
    if (err) return cb(err);

    tags.forEach(function (tag) {
      var c = _substrCount(text, tag.name);
      if (c) {
        results.push({count: c, tag: tag});
      }
    });

    results.sort(function (a, b) {
      if (a.count = b.count) return 0;
      return a.count > b.count ? -1 : 1;
    });
    results = results.slice(0, count);

    cb(null, results.map(function (result) {return result.tag;}));
  });
};

Tags.data = function (cb) {
  if (tags.length === 0) {
    Tag.find(function (err, data) {
      if (err) return cb(err);
      cb(null, tags = data);
    });
  } else {
    cb(null, tags);
  }
};

exports.Tags = Tags;

function _substrCount(str, substr) {
  var count = 0;
  var offset = 0;
  do {
    offset = str.indexOf(substr, offset);
    if (offset != -1) {
      count++;
      offset += substr.length;
    }
  } while (offset != -1)

  return count;
}

function _tagReplace(text, tags) {
  if (tags.length) {
    while (tag = tags.shift()) {
      var isTagReplaced = false;
      text = text.replace(/(^|>)([^<]+)(?=<|$)/g, function (str) {
        if (isTagReplaced) {
          return str;
        } else {
          return str.replace(new RegExp(tag.name), function (str) {
            isTagReplaced = true;
            return '<a href="' + tag.external + '"-]-' + str + '-[-/a>';
          });
        }
      });
    }
  }

  return text.replace(/-\]-/g, '>').replace(/-\[-/g, '<');
}
