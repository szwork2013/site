/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

var article = new Article();
article.title = draft.title;
article.url = Math.round(Math.random() * 10000);
article.category = draft.category;
article.keyword = draft.keyword;
article.description = draft.description;
article.tag = tag;
article.recommend = tag.length >= 2 ? 1 : 0;
article.save(function(err){
  if (err) throw err;
  var content = new Content();
  content._id = article._id;
  content.origin = draft.content;
  content.normal = body;
  content.shuffle = Text.shuffle(body);
  content.save(function(err){
    if (err) {
      article.remove(function(err){
        console.log('文章内容发布失败,删除该文章发生错误' + err);
      });
    } else {
      console.log(article.title + '发布成功');
    }
  });
});