---
layout: post
title: "如何打包一个 Gem"
date: 2012-07-28 23:37
comments: true
author: xdite
categories: development
tags: ['gem','rails','bundler']
---
这篇文章转载自[xdite的blog](http://blog.xdite.net/posts/2012/01/04/how-to-pack-a-gem/)

# What is Gem

RubyGems 是 Ruby 的 Package 管理系统。它的作用类似 Linux 系统下的 apt-get 或者是 yum。不同的是：RubyGems 是提供「打包」好的 Ruby Library 让开发者能够重複利用别人已造好的轮子，提高开发效率。

而目前 Rails 3.0+ 起，几乎都也推荐使用 RubyGems 的方式，将 Plugin 打包成 Gem 的方式搭配 Bundler 使用。

# 打包 Gem

随着时代进步，打包和发佈 Gem 的方式一直在进步。
最早以前大家都是手工製造 ( RailsCast #135 )，后来 Jeweler( RailsCast #183 ) 被发明出来，让打包变得非常容易。
而到最后，更演变成了 Bundler 内建 ( Rails 245 )。
包装一个 Gem 变得越来越容易。
<!--more--> 
# Gem 的基本结构

若以 Bundler 内建的指令 bundle gem GEM_NAME 自动生出来的档桉。其实 Gem 的结构也相当简单。
    [~/projects/exp] $ bundle gem my_plugin
          create  my_plugin/Gemfile
          create  my_plugin/Rakefile
          create  my_plugin/.gitignore
          create  my_plugin/my_plugin.gemspec
          create  my_plugin/lib/my_plugin.rb
          create  my_plugin/lib/my_plugin/version.rb
    Initializating git repo in /Users/xdite/projects/exp/my_plugin

* `Gemfile` # 描述 dependency
* `Rakefile` # 发佈和打包的 rake tasks
* `GEM_NAME.gemspec` # gem 的 spec
* `GEM_NAME/lib/GEM_NAME.rb` 与 GEM_NAME/lib/GEMNAME/ # gem 裡的 library
* `GEM_NAME/lib/GEM_NAME/version.rb` # 版本纪录
主要的 Library 需放置在 lib/ 底下。

若需使用到相依套件的话，需在 Gemfile 以及 .gemsepc 定义。

# Bundler 提供的基本 Task

Bundler 基本上算是提供半自动的打包，只提供非常基本的三个 Task：

1. `rake build` # Build my_plugin-0.0.1.gem into the pkg directory
2. `rake install` # Build and install my_plugin-0.0.1.gem into system gems
3. `rake release` # Create tag v0.0.1 and build and push my_plugin-0.0.1.gem to Rubygems

# Jeweler

若你有更多懒人需求，不妨 check Jeweler 这个 gem，它提供了更多 rake tasks 让打包更加方便。

# Best Practices

Rails Core Team member 「Josh Peek」曾经在 Rails 官方 blog 写过一篇文章 Gem Packaging: Best Practices 讲解如何写出比较乾淨正确的 Gem。

如何在专桉中使用开发中的 gem

以往的想法可能都是打包之后，在 local 安装开发中的 gem 版本，或者是直接先放在 vendor/plugins 中测试。在有了 Bundler 的时代其实不需要这麽麻烦。

只要在 Gemfile 内加入这样一行


    gem 'my_plugin', :path => "~/projects/exp/my_plugin"  # your local gem path 

就可以引用开发中的 gem，等到真的开发完。再换成 git repo 或 rubygems.org 上的版本。
