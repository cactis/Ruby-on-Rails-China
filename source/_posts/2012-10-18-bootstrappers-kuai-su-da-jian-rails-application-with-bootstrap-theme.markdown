---
layout: post
title: "Bootstrappers 快速搭建 Rails Application with Bootstrap Theme"
date: 2012-10-18 11:50
comments: true
categories: RubyChina
author: xdite
---
转载自[Ruby-China](http://ruby-china.org/topics/5922)
[https://github.com/xdite/bootstrappers](https://github.com/xdite/bootstrappers)

這是我今天才發布的一個 gem。目的是可以快速產生一個內建 Bootstrap Theme
的 Rails Application。

因為前幾天看到 thoughtbot 放出了他們內部快速搭建 app 的 gem
[https://github.com/thoughtbot/suspenders](https://github.com/thoughtbot/suspenders)
。

想到自己手上也有一個套好 bootstrap 的樣本
application，每次複製實在很沒有效率，於是也仿照作一個產生器。

裡面內建了這些 gem，都是我平常寫 application 會用到的。

Bootstrap SCSS\
 Bootstrap Helper\
 SimpleForm\
 WillPaginate\
 Compass\
 SeoHelper\
 Capistrano\
 Cape\
 Magic encoding\
 Settingslogic\
 Airbrake\
 NewRelic RPM\
 Turbo Sprockets for Rails 3.2.x

#### 

P.S. 請注意這個產生器是使用 MySQL，帳號是 root 密碼是空值
