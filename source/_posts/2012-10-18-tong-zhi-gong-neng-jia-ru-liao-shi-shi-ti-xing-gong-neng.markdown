---
layout: post
title: "通知功能加入了实时提醒功能"
date: 2012-10-18 11:46
comments: true
categories: RubyChina
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/5250)
现在有新通知出现的时候，无需刷新页面就能知道了。

使用 [Faye](https://github.com/faye/faye) 实现，直接用 Ruby EventMachine
那个版本来跑的，没有用 Node.js。

* * * * *

~~稍后加入 Mountain Lion 的通知提醒和 Chrome 桌面提醒。~~\
 已加入桌面提醒功能。\
 现在桌面提醒点击以后即可打开有关的页面，同时提醒将会显示在 Mountian Lion
的 Notification Center 里面了；

* * * * *

求各种浏览器的效果反馈

#### 已确定支持浏览器

-   Chrome
-   Safari
-   Firefox (需要安装
    [ff-html5notifications](https://code.google.com/p/ff-html5notifications))
