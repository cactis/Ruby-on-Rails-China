---
layout: post
title: "Homeland - 嵌入式的论坛组件"
date: 2012-10-17 22:37
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/2661)
越来越发现，我的每个项目中都需要类是 Ruby China 或 V2EX
这样的论坛功能，用于用户反馈讨论什么的，之前一直是拷贝代码来实现。

最近将 Homeland 改成了可以嵌入到任何项目的 Gem， 它可以像 Devise
一样直接签入到任何系统中（目前只有 Mongoid 支持，后面会实现
ActiveRecord）。

[https://github.com/huacnlee/homeland](https://github.com/huacnlee/homeland)

#### 安装

加入 gem `Gemfile`

    gem "homeland"

然后

    $ rails g homeland:install

还需要调整一下 `application.html.erb` 里面有连接的地方\
 before:

    <%= link_to "Home", root_path %>
    <%= link_to "Posts", posts_path %>

after:

    <%= link_to "Home", main_app.root_path %>
    <%= link_to "Home", main_app.posts_path %>

`routes.rb` 里面加入:

    mount Homeland::Engine, :at => "/bbs"

application.js 里面引入

    /*
     *= require homeland
     */

application.css 里面引入

    /*
     *= require homeland
     */

然后你就可以输入 /bbs 打开论坛了

#### 定制 Views

如果你想自己调整 View 结构的话，你可以用这个命令把 View 生成出来:

    $ rails g homeland:views

然后修改 app/views/homeland/ 里面的文件
