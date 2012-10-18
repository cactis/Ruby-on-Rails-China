---
layout: post
title: "API service 的开发"
date: 2012-10-17 22:19
comments: true
categories: Ruby-China
author: fredwu
---
转载自[Ruby-China](http://ruby-china.org/topics/1782)
虽然Rails社区非常的成熟，但是很令人意外的是，开发API web
service方面的资料非常之少。

Intridea有个Grape：[https://github.com/intridea/grape](https://github.com/intridea/grape)
但是与Rails以及其他的gem配合度不够高。

袋鼠国的Darcy
Laycock前几天发布了个新的gem，RocketPants：[https://github.com/filtersquad/rocket\_pants](https://github.com/filtersquad/rocket_pants)
用来开发API service，与Rails的配合度较高。

但是，对于简单的API service/client架构，ActiveResource还是最方便的。

经过测试，报告给大家，可以结合RocketPants + ActiveResource +
InheritedResources
([https://github.com/josevalim/inherited\_resources](https://github.com/josevalim/inherited_resources))
一起使用，效果非常不错。

RocketPants用来控制API版本，以及JSON的错误输出。

很好很强大。：）
