---
layout: post
title: "Rails 3.1 Assets Pipeline 应该怎么配置？"
date: 2012-10-17 21:50
comments: true
categories: Ruby-China
author: suupic
---
转载自[Ruby-China](http://ruby-china.org/topics/201)
js/css文件加载不上，求解

#### 环境：

-   rails 3.1.3
-   unicorn 4.1.1
-   nginx 1.0.6

#### 现象：

1.  用rails
    s启动开发模式，一切正常。请求地址为http://dev:3000/assets/application.js?body=1
2.  用rails s -e production 启动，assets
    pipeline异常。请求地址为http://dev:3000/javascripts/application.js，404错误
3.  用unicorn -c config/unicorn.rb
    启动，异常。请求地址为http://dev/assets/application.js?body=1，
    404错误
4.  用unicorn -c config/unicorn.rb -E
    production启动，异常。请求地址为：http://dev/javascripts/application.js，
    404错误。且仅加载application.js/css，上面3种情况则会加载很多其他的js/css

404时，\
 nginx的日志为：

    open() "xxxxx/public/assets/application.js" failed (2: No such file or directory

rails的日志为：

    ActionController::RoutingError (No route matches [GET] "/javascripts/application.js"):

unicorn的日志为：

    cache: [GET /javascripts/application.js] miss

production配置(局部，其他选项默认）为：

    config.serve_static_assets = false
    config.assets.compress = true
    config.assets.compile = false
    config.assets.digest = true
    config.assets.debug = true
