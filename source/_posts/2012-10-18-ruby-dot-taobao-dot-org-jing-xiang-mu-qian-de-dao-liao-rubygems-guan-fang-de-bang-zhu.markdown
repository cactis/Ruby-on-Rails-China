---
layout: post
title: "ruby.taobao.org 镜像目前得到了 Rubygems 官方的帮助"
date: 2012-10-18 11:44
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/4764)
这两天 ruby.taobao.org 被 rubygems.org
官方的维护人员发现了，联系上以后他给了我一些改进镜像服务的建议

目前 ruby.taobao.org 已经换了一个方式来实现镜像（其实就是 Nginx proxy +
caching，只是有方法的配置文件帮助，要靠谱许多）

配置文件就在:
[https://github.com/rubygems/rubygems.org-configs](https://github.com/rubygems/rubygems.org-configs)

接下啦，rubygems 的官方服务上面将做 IP 判断，自动把国内用户转向到 Taobao
镜像服务器，这样一来，以后大家就不用修改 gem remote 了。
