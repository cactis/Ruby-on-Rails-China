---
layout: post
title: "Sinatra+Backbone/ To-do App分享"
date: 2012-10-18 11:40
comments: true
categories: Ruby-China
author: kenshin716
---
转载自[Ruby-China](http://ruby-china.org/topics/4301)
这周接触Sinatra, 并搭建了一个简单的to-do App.

先简单谈谈使用感受,\
 轻量, 是最大的优点, 相信有代码洁癖的人会喜欢;\
 对RESTful的支持也很好, ajax的交互体验一下就上去了.

=======================================

其次介绍下我做的这个小Demo

我使用了Sinatra+DataMapper+Sqlite3作为服务端基础\
 前端使用了jQuery+Underscore+Backbone\
 样式是bootstrap

三个简单的表结构

用户|项目|todo

用户与项目的增删改查是同步的交互模式,\
 todo是异步的.

    >$.ajax({
    >   url: _model.url,
    >   type: 'POST',
    >   beforeSend: function(xhr) {
    >               xhr.setRequestHeader('X-HTTP-Method-Override', 'PUT');
    >        },
    >   success: function(res, status, xhr){
    >       _model.fetch();
    >       _self.renderTask(res, status, xhr);
    >   },
    >   error: _self.error
    >});

通过设定请求头的X-HTTP-Method-Override参数, 实现RESTful

截图:\
![](http://l.ruby-china.org/photo/c643ceaa1c31472416adf6a6ab134816.png)

git:\

[[https://github.com/qiaosu/Sinatra-Backbone-TodoApp](https://github.com/qiaosu/Sinatra-Backbone-TodoApp)]

第一次发帖, 请多多关照, 多提意见.

ps. 小弟ruby新手, 代码调试真累啊...
