---
layout: post
title: "merit - 用更优雅的方式构建的网站的积分，等级，徽章系统"
date: 2012-10-17 22:51
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/3571)
昨天在 Github 上面发现这个东西 [merit](https://github.com/tute/merit)
用于实现积分，等级功能的设计。

![](http://l.ruby-china.org/photo/241abc31b2b1693648b238d2f58c41c9.jpg)

它的设计理念感觉和 CanCan
很想，一个中心文件管理积分，等级的逻辑，调用是通过关注 Controller
的事件来执行，写出来的代码会变得干干净净，不会在很多的 Callback
里面塞积分加减的事件。

难得的是，这玩意支持 ActiveRecord 和
MongoMapper，而我昨天[稍加修改](https://github.com/huacnlee/merit)后现在可以支持
Mongoid 了。

比如积分的业务定义像这样:

    module Merit
      class PointRules
        include Merit::PointRulesMethods
        def initialize
          # 修改个人信息
          # score 5, :on => 'users#update'
          # 发评论
          score 1, :on => 'comments#create'
          # 上传图片
          score 20, :on => 'photos#create'
          # 论坛发帖
          score 2, :on => 'topics#create'
          score 1, :on => 'replies#create'
        end
      end
    end

徽章的业务定义：

    module Merit
      class BadgeRules
        include Merit::BadgeRulesMethods

        def initialize
          grant_on 'users#create', :badge => 'just-registered', :to => :itself

          grant_on 'comments#create', :badge => 'commenter', :level => 10 do |comment|
             comment.user.comments.count == 10
          end

          grant_on 'comments#vote', :badge => 'relevant-commenter', :to => :user do |comment|
            comment.votes.count == 5
          end

          grant_on 'registrations#update', :badge => 'autobiographer', :temporary => true, :model_name => 'User' do |user|
            user.name.length > 4
          end
        end
      end
    end

[https://github.com/tute/merit](https://github.com/tute/merit)
