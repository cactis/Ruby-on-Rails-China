---
layout: post
title: "RVM 出的 Ruby 补丁包"
date: 2012-10-17 22:49
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/3468)
针对各种不同的版本，直接一条命令搞定

#### 其中包含的 Patch:

-   railsbench-gc.patch
-   display-more-detailed-stack-trace.patch
-   fork-support-for-gc-logging.patch
-   track-live-dataset-size.patch

#### 安装

    rvm get head
    rvm install 1.8.7 --patch railsexpress
    rvm install 1.9.2 --patch railsexpress
    rvm install 1.9.3 --patch railsexpress

[https://github.com/skaes/rvm-patchsets](https://github.com/skaes/rvm-patchsets)
