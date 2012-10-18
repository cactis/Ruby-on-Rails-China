---
layout: post
title: "meta_search 帮助你实现复杂的组合查询"
date: 2012-10-17 21:52
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/393)
我们时常会做这么样的组合过滤功能：\
![Aee6d40be062e96a69484418132cdfcc](http://l.ruby-china.org/photo/aee6d40be062e96a69484418132cdfcc.png)

像上面这个才4的，有的时候甚至有7,8种，当你做好功能以后你会发现你的 View 和
Controller 里面会很复杂，尤其是 Controller 里面。\
 这个时候，你需要 meta\_search 这个 Gem

[https://github.com/ernie/meta\_search](https://github.com/ernie/meta_search)

它可以帮你自动组合多种不同的条件

比如这样:

app/controllers/articles\_controller.rb

    def index
      @search = Article.search(params[:search])
      @articles = @search.paginate(:page => params[:page])
    end

app/views/articles/index.html

    <%= form_for @search, :url => articles_path, :html => {:method => :get} do |f| %>
      <%= f.label :title_contains %>
      <%= f.text_field :title_contains %><br />
      <%= f.label :comments_created_at_greater_than, 'With comments after' %>
      <%= f.datetime_select :comments_created_at_greater_than, :include_blank => true %><br />
      <!-- etc... -->
      <%= f.submit %>
    <% end %>
