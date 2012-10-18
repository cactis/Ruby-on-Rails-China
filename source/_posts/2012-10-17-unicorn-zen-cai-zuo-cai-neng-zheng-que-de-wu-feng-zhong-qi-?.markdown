---
layout: post
title: "Unicorn 怎才做才能正确的无缝重启？"
date: 2012-10-17 21:49
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/113)
目前我的用法是:

    $ cat cat tmp/pids/unicorn.pid
    25361
    $ kill -USR2 25361

但是，我发现这样做了以后，进程列表会出现两份，新的是启动上来了，但是老的进程依然存在，除非我再
kill -QUIT 25361 这个进程

我这个方法不知道对不对
