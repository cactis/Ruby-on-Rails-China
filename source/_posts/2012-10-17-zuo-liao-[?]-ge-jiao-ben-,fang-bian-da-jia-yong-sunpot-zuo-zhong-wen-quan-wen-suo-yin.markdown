---
layout: post
title: "做了一个脚本，方便大家用 Sunpot 做中文全文索引"
date: 2012-10-17 21:51
comments: true
categories: RubyChina
author: quakewang
---
转载自[Ruby-China](http://ruby-china.org/topics/305)
sunspot (
[https://github.com/sunspot/sunspot](https://github.com/sunspot/sunspot)
)
经过这几年的发展，已经非常完善，在ruby做全文索引属于首选方案，但是原始配置不支持中文分词，我做了一个脚本，可以很方便build一个带mmseg4j
( [http://code.google.com/p/mmseg4j/](http://code.google.com/p/mmseg4j/)
) 分词算法的solr server:

[https://github.com/quake/sunspot\_chinese\_example](https://github.com/quake/sunspot_chinese_example)

欢迎反馈.
