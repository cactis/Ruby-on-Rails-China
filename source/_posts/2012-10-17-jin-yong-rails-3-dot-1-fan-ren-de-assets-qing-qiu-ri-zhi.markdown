---
layout: post
title: "禁用 Rails 3.1 烦人的 assets 请求日志"
date: 2012-10-17 21:49
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/105)
Rails 3.1 为我们带来了 Asset Pipeline ，同时也带来了烦人的 asset log 在
Rails 控制台里面，尤其是项目大，JS,CSS 小文件多的情况，都没法认真的关注查询
log 了...

    Started GET "/topics" for 127.0.0.1 at 2011-11-21 15:15:29 +0800
      Processing by TopicsController#index as HTML
    MONGODB ruby_china['topics'].find({}).sort([[:_id, :desc]])
    Rendered topics/_base.html.erb (1.1ms)
    Rendered topics/index.html.erb within layouts/application (30.9ms)
    Completed 200 OK in 58ms (Views: 53.9ms)
    Served asset /bootstrap.css - 304 Not Modified (0ms)
    Served asset /application.css - 304 Not Modified (1ms)
    Served asset /front.css - 304 Not Modified (0ms)
    Served asset /jquery.jdialog.css - 304 Not Modified (0ms)
    Served asset /jquery.js - 304 Not Modified (0ms)
    Served asset /jquery_ujs.js - 304 Not Modified (0ms)
    Served asset /jquery.jdialog.js - 304 Not Modified (0ms)
    Served asset /jquery.tipsy.js - 304 Not Modified (0ms)
    Served asset /will_paginate.js - 304 Not Modified (0ms)
    Served asset /bootstrap-tabs.js - 304 Not Modified (0ms)
    Served asset /application.js - 304 Not Modified (0ms)
    Served asset /logo_big.png - 304 Not Modified (10ms)

赶紧禁用它吧！

config/environments/development.rb 里面加入

    YouApp::Application.configure do
      ...
      # 加入这个
      config.after_initialize do |app|
        app.assets.logger = Logger.new('/dev/null')
      end
    end

    Rails::Rack::Logger.class_eval do
      def before_dispatch_with_quiet_assets(env)
        before_dispatch_without_quiet_assets(env) unless env['PATH_INFO'].index("/assets/") == 0
      end
      alias_method_chain :before_dispatch, :quiet_assets
    end

从此世界清净了!

关于这个， Rails Issue 里面又很多人在说了：
[https://github.com/rails/rails/issues/2639](https://github.com/rails/rails/issues/2639)
