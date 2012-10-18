---
layout: post
title: "time_bandits - 让 Rails Log 里面的耗时信息更加详细"
date: 2012-10-17 22:50
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/3471)
在 Rails 的 log 里面会有这样的信息显示本次请求的耗时都在什么地方\
 下面是 Ruby China 的例子:

    Completed 200 OK in 154ms (Views: 130.9ms | Mongo: 16.0ms | Solr: 0.0ms)

而 `time_bandits` 这个东西可以帮你显示更多的信息

-   Memcached 请求耗时
-   GC 耗时
-   ...

<!-- -->

    Completed 200 OK in 680.378ms (Views: 28.488ms, ActiveRecord: 5.111ms(2q,0h), MC: 5.382(6r,0m), GC: 120.100(1), HP: 0(2000000,546468,18682541,934967))

[https://github.com/skaes/time\_bandits](https://github.com/skaes/time_bandits)
