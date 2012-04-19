/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var Tags = require('./lib/tags').Tags;
var EventProxy = require('eventproxy').EventProxy;

var text = '妇科炎症是女性的常见疾病，主要是指女性生殖器官的炎症，具体包括女性外阴炎、阴道炎、宫颈炎、盆腔炎。支原体、衣原体感染，只要没有症状，支原体阳性只是它在人体内正常寄居，这是正常的，不必担心。从病原学来说，支原体的致病能力弱于很多其它病原体，所以当真的出现炎症而且检查出支原体阳性时，首先要考虑有无其它病原体。因为往往是其它病原体导致宫颈炎后，身体局部抗病能力下降，才继发盆腔炎的。此时，支原体只是“过客”。妇科炎症是女性的常见疾病，主要是指女性生殖器官的炎症，具体包括女性外阴炎、阴道炎、宫颈炎、盆腔炎。支原体、衣原体感染，只要没有症状，支原体阳性只是它在人体内正常寄居，这是正常的，不必担心。从病原学来说，支原体的致病能力弱于很多其它病原体，所以当真的出现炎症而且检查出支原体阳性时，首先要考虑有无其它病原体。因为往往是其它病原体导致宫颈炎后，身体局部抗病能力下降，才继发盆腔炎的。此时，支原体只是“过客”。妇科炎症是女性的常见疾病，主要是指女性生殖器官的炎症，具体包括女性外阴炎、阴道炎、宫颈炎、盆腔炎。支原体、衣原体感染，只要没有症状，支原体阳性只是它在人体内正常寄居，这是正常的，不必担心。从病原学来说，支原体的致病能力弱于很多其它病原体，所以当真的出现炎症而且检查出支原体阳性时，首先要考虑有无其它病原体。因为往往是其它病原体导致宫颈炎后，身体局部抗病能力下降，才继发盆腔炎的。此时，支原体只是“过客”。妇科炎症是女性的常见疾病，主要是指女性生殖器官的炎症，具体包括女性外阴炎、阴道炎、宫颈炎、盆腔炎。支原体、衣原体感染，只要没有症状，支原体阳性只是它在人体内正常寄居，这是正常的，不必担心。从病原学来说，支原体的致病能力弱于很多其它病原体，所以当真的出现炎症而且检查出支原体阳性时，首先要考虑有无其它病原体。因为往往是其它病原体导致宫颈炎后，身体局部抗病能力下降，才继发盆腔炎的。此时，支原体只是“过客”。';

/*
setInterval(function () {
  console.time('publish');
  var proxy = EventProxy.create();
  proxy.assign('draft', 'tag', 'content', function (draft, tag, content) {
    console.log('tag.length', tag.length, 'content.length', draft.length);
    console.timeEnd('publish');
  });

  proxy.trigger('draft', text);

  console.time('tag');
  Tags.analyse(text, function (err, tag) {
    proxy.trigger('tag', tag);
    console.timeEnd('tag');
  });

  console.time('replace');
  Tags.replace(text, function (err, content) {
    console.timeEnd('replace');
    proxy.trigger('content', content);
  });
}, 5000);
*/

setInterval(function () {
  console.time('tag');
  Tags.analyse(text, function (err, tag) {
    console.log(tag);
    console.timeEnd('tag');
  });
}, 5000);