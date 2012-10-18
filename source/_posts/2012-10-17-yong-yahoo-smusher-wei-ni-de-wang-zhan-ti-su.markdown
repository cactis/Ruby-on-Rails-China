---
layout: post
title: "用 Yahoo Smusher 为你的网站提速"
date: 2012-10-17 21:49
comments: true
categories: RubyChina
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/136)
主要是优化图片大小的，有 smusher 这个 Gem

[https://github.com/grosser/smusher](https://github.com/grosser/smusher)

    $ smusher /apps/ts/public/images
    smushing /apps/rs/public/images/social/facebook_icon.png
    2887 -> 132                              = 4%

    smushing /apps/rs/public/images/social/myspace_icon.png
    3136 -> 282                              = 8%

    smushing /apps/rs/public/images/dvd/dvd_1.png
    5045 -> 4                                = 0%
    reverted!
    ...

原文：\
[http://adventuresincoding.com/2011/11/speed-up-your-websites-with-smusher](http://adventuresincoding.com/2011/11/speed-up-your-websites-with-smusher)
