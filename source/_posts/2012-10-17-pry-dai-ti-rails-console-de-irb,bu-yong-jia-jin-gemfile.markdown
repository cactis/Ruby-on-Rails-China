---
layout: post
title: "pry 代替 Rails console 的 irb，不用加进 Gemfile"
date: 2012-10-17 22:34
comments: true
categories: Ruby-China
author: doitian
---
转载自[Ruby-China](http://ruby-china.org/topics/2471)
原理就是先不加载 Bundler，用 rubygems 把 pry awesome\_print 等 gems
加进来以后来把 rails app 加进来。把 `Rails::Console::IRB` 设置成 `Pry`，
Hack下 `ARGV`，就可以交给 rails/commands 处理了

已经包装成 gem
[rails-console-pry](https://github.com/doitian/rails-console-pry)，安装不走
bundler，如果用了 rvm gemset，需要安装到 gemset 中。顺带可以安装些 pry
plugins

    gem install rails-console-pry pry-doc awesome_print

然后在 rails app 根目录直接

    rails-console-pry

或者进 `production` 环境

    rails-console-pry production

需要在 Bundler 之前加载插件（就是指不在 Gemfile 中的插件）用 `-r` 选项

    rails-console-pry -r pry-doc -r awesome_print

最好是加个 alias

    alias rpry='rails-cosnole-pry -r pry-doc -r awesome_print'

* * * * *
