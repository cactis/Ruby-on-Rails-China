---
layout: post
title: "如何处理好复杂逻辑的 View？"
date: 2012-10-17 21:49
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/135)
刚刚才 Twitter 上面和 [*@*xdite](/xdite "@xdite")
讨论到这个话题，顺便也拋出来聊聊\
 以之前 zheye 这个项目为例，比如这个页面：\
[https://github.com/huacnlee/quora/blob/master/app/views/logs/\_log.html.erb](https://github.com/huacnlee/quora/blob/master/app/views/logs/_log.html.erb)

业务需求就是有这么多的逻辑，而且是由于项目不断变化带来愈来愈多的逻辑，有些页面就必然会变得这么复杂，后面维护起来就成问题了。

大家有没有什么好的方法处理复杂的页面？
