---
layout: post
title: "分享一个 attr_accessor 的技巧"
date: 2012-10-17 21:52
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/413)
这个是这周二杭州 Ruby Tuesday 扯出来的\
 比如这样的场景，你有个 Post ，它有 tags 的属性，里面用 Array 存放多个
tag，但是页面上编辑的时候我们可能会要用户输入以逗号隔开的方式提交多个 tag
（比如： ruby, rails, python ）然后保存的是将这个数据分割为数组保存。\
 代码就像这样，只是我以前的写法。

    class Post
      include Mongoid::Document
      field :title
      field :body
      filed :tags, :as => Array, :default => []

      attr_accessor :tag_list

      before_save :split_tags
      def split_tags
        if !self.tag_list.blank?
          self.tags = self.tag_list.split(",")
        end
      end
    end

而且我还需要在 Controller 里面修改的时候将 tags 转换为逗号分隔的
tag\_list

    class PostsController < ApplicationController
      def edit
        @post = Post.find(params[:id])
        @post.tag_list = @post.tags.join(",")
      end
    end

    <% form_form(@post) do %>
      <%= f.input :tag_list %>
    <% end %>

但是实际使用的时候却又很多麻烦，因为 before\_save
会又很多动作都会经过，而且如果很多类似这种场景的都写 before\_save 或者
after\_save
里面的话，这里的逻辑会越来越乱，而导致后面看起来很累，而且容易出问题。

于是，我们聊出了新的做法，覆盖 attr\_accessor 的 get set
方法来实现分割为数组的动作。

    class Post
      ...
      def tag_list=(value)
        self.tags = value.split(",") if !value.blank?
      end

      def tag_list
        return "" if self.tags.blank?
        self.tags.join(",")
      end
    end

这样一来， Controller 里面就不用写了，直接调用 tag\_list，它的改变将会和
tags 息息相关
