/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

function Text() {}

Text.substr = function (str, length, suffix) {
  suffix = suffix == null ? '&hellip;' : suffix;

  if (str.length <= length) {
    return str;
  }

  return str.substr(0, length) + suffix;
};

Text.shuffle = function (text) {
  var matching = _castDelimiter(text);
  var result = '';
  matching.paragraph.forEach(function (paragraph) {
    result += _shuffleParagraph(paragraph, matching.delimiter);
  });

  return result;
};

exports.Text = Text;

var symbols = ['。', '；', '，', '.', ','];
var delimiters = [
  {delimiter: 'p', regex: /<p>(.+?)<\/p>/g},
  {delimiter: 'br', regex: /<br>|<br\/>|<br \/>/g},
  {delimiter: 'crlf', regex: /\n|\r\n/g}
];

function _castDelimiter(text) {
  var sections = [];
  for (var i = 0; i < delimiters.length; i++) {
    var delimiter = delimiters[i];
    sections = text.split(delimiter.regex);
    sections = sections.filter(function (item) {return item !== '';});
    if (sections.length >= 2) {
      return {delimiter: delimiter.delimiter, paragraph: sections};
    }
  }

  return {delimiter: null, paragraph: [text]};
}

function _shuffleParagraph(paragraph, label) {
  var sentences = [];
  for (var i = 0; i < symbols.length; i++) {
    var symbol = symbols[i]
    sentences = paragraph.split(symbol);
    sentences = sentences.filter(function (item) {return item !== '';});
    if (sentences.length >= 4) {
      var start = sentences.shift();
      var end = sentences.pop();
      sentences.sort(function (a, b) {return Math.random() > 0.5 ? -1 : 1;});
      sentences.unshift(start);
      sentences.push(end);
      sentences = sentences.join(symbol);
      break;
    }
  }

  switch (label) {
    case 'p':
      return '<p>' + sentences + '</p>';
      break;
    case 'br':
      return sentences + '<br/>';
      break;
    case 'crlf':
      return sentences + '\n';
      break;
    case null:
      return sentences;
      break;
  }
}
