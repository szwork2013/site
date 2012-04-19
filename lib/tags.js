/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

function Tags() {}

Tags.replace = function (text, tags) {
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
};

Tags.analyse = function (text, tags, count) {
  count = count || 5;

  var results = [];
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

  return results.map(function (result) {return result.tag;});
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
