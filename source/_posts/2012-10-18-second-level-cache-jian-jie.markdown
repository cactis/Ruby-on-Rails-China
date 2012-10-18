---
layout: post
title: "second level cache 简介"
date: 2012-10-18 11:48
comments: true
categories: RubyChina
author: hooopo
---
转载自[Ruby-China](http://ruby-china.org/topics/5535)
**简介：**\
[second\_level\_cache](https://github.com/csdn-dev/second_level_cache)是一个[cache
money](https://github.com/nkallen/cache-money)的轻量级实现，支持Rails3.2版本。

**安装：**\
 在Gemfile里：

    gem "second_level_cache", "~> 1.5"

**使用：**

    class User < ActiveRecord::Base
      acts_as_cached(:version => 1, :expires_in => 1.week)
    end

**特性：**

1.  和cache\_money类似，只需要在model里做一次声明，不影响正常的`ActiveRecord`查询接口。可以方便的添加/移除缓存插件无须修改任何代码。

2.  方便的缓存清理机制。提供清理各个粒度缓存内容的接口（包括清理所有second\_level\_cache的缓存、清理单个model的所有记录的缓存、清理单条记录的缓存）

3.  通过callback使缓存和数据库保持同步。甚至对AR里大部分[不调用callback的方法](http://huacnlee.com/blog/active-model-callback-call-with-methods/)（比如`update_column`和`update_counter`等）进行处理，保持缓存和数据库同步。

4.  可以缓存has\_one和belongs\_to还有带条件的find查询，比如：user.topics.where(:status
    =\> 1).find(1)

5.  提供`fetch_by_uniq_key`和`fetch_by_uniq_key!`方法，来缓存非主键的唯一列,比如：

<!-- -->

     User.fetch_by_uniq_key("hooopo", :nick_name)
     Tag.fetch_by_uniq_key!("ruby", :name)

上面的查询会使用缓存，非常适合这样的url：[http://book.douban.com/tag/%E5%B0%8F%E8%AF%B4](http://book.douban.com/tag/%E5%B0%8F%E8%AF%B4)
或 [http://ruby-china.org/hooopo](http://ruby-china.org/hooopo)

更完整的介绍:
[https://github.com/csdn-dev/second\_level\_cache](https://github.com/csdn-dev/second_level_cache)
