---
layout: post
title: "Rails log 自动分割该怎么配置才正确"
date: 2012-10-17 22:54
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/3704)
Rails 产品环境的 production.log
越来越大，自己尝试着给他加分割的动作，结果跑了一段时间以后发现没有成功

app/config/environments/production.rb

    config.logger = Logger.new("#{Rails.root}/log/#{Rails.env}.log",7)
    # 也尝试过
    config.logger = Logger.new("#{Rails.root}/log/#{Rails.env}.log",'weekly')

结果日志文件变成这样了:

    -rw-rw-r-- 1 jason jason  145 Jun  5 09:40 log/production.log.20120602.1
    -rw-rw-r-- 1 jason jason  151 Jun  5 10:23 log/production.log.20120602.10
    -rw-rw-r-- 1 jason jason  150 Jun  5 10:24 log/production.log.20120602.11
    -rw-rw-r-- 1 jason jason  150 Jun  5 11:12 log/production.log.20120602.12
    -rw-rw-r-- 1 jason jason 360K Jun  5 16:58 log/production.log.20120602.13
    -rw-rw-r-- 1 jason jason  151 Jun  5 11:34 log/production.log.20120602.14
    -rw-rw-r-- 1 jason jason  151 Jun  5 11:34 log/production.log.20120602.15
    -rw-rw-r-- 1 jason jason  144 Jun  5 11:37 log/production.log.20120602.16
    -rw-rw-r-- 1 jason jason  144 Jun  5 11:38 log/production.log.20120602.17
    -rw-rw-r-- 1 jason jason  151 Jun  5 11:39 log/production.log.20120602.18
    -rw-rw-r-- 1 jason jason  151 Jun  5 11:39 log/production.log.20120602.19
    ...
    还有很多，都是 20120602 的

而不是相像的那样，7天分割一个

差了好多地方，看起来他们也是这么配置的
