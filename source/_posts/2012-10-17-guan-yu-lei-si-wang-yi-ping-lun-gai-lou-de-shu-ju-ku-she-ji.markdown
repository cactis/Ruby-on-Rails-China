---
layout: post
title: "关于类似网易评论盖楼的数据库设计"
date: 2012-10-17 22:35
comments: true
categories: Ruby-China
author: Tony
---
转载自[Ruby-China](http://ruby-china.org/topics/2533)
关于类似网易评论盖楼的数据库设计\
 或者reddit那种方式，对评论进行评论\
 表应该怎么设计？

我的想法是一次性把某主题下所有的评论全部读取处理，做完处理再显示\
 但要是评论很多，一次性全部取出来耗资源，大家有没有更优化的设计想法？
