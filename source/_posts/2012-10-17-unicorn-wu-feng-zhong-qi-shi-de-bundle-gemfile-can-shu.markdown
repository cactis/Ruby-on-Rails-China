---
layout: post
title: "Unicorn 无缝重启时的 BUNDLE_GEMFILE 参数"
date: 2012-10-17 22:45
comments: true
categories: RubyChina
author: saberma
---
转载自[Ruby-China](http://ruby-china.org/topics/3190)
使用Unicorn实现无缝重启后，有时候会发现更新版本后的 Gem 没有生效，Rails
取的总是之前旧版本的 Gemfile.lock 文件来定位 Gem。\
 检查后发现是 config/boot.rb 中的 BUNDLE\_GEMFILE 参数值不正确

    ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

假设现在第一次发布版本，版本目录为2012051001，启动Unicorn，**ENV['BUNDLE\_GEMFILE']的值为
2012051001/Gemfile**\
 第二次发布版本，此版本更新了haml的版本，版本目录为2012051002，在本地运行
cap deploy 命令无缝重启 Unicorn，这个时候 Unicorn 不会清除 ENV 中的
BUNDLE\_GEMFILE 参数值，**其值仍为 2012051001/Gemfile**，导致 rails
在启动时使用的是旧版本的haml

这时，可以手动把 Unicorn kill掉，再重新启动，问题消失，但就做不到无缝重启了

Unicorn 文档有提供针对此问题的解决方法，修改 config/unicorn.conf.rb
配置文件，增加：

    before_exec do |server|
      ENV["BUNDLE_GEMFILE"] = "/u/apps/#{application}/current/Gemfile"
    end

搜索 "unicorn BUNDLE\_GEMFILE"
发现国外也有不少人中招，主要是使用cap清除旧的发布目录后，提示找不到
Gemfile
