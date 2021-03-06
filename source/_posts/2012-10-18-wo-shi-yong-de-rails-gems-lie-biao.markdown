---
layout: post
title: "我使用的 Rails Gems 列表"
date: 2012-10-18 11:46
comments: true
categories: RubyChina
author: lilu
---
转载自[Ruby-China](http://ruby-china.org/topics/5205)
比较主观的一个列表，就不添加到社区的gems wiki里了

最新更新在[这里](http://lilulife.com/recommends/)

#### Rails Test Drive

-   [rspec-rails](https://github.com/rspec/rspec-rails)

行为测试框架rspec的rails集成

-   [jasminerice](https://github.com/bradphelan/jasminerice)

javascript测试框架jasmine的rails集成

-   [capybara](https://github.com/jnicklas/capybara)

web行为模拟框架

-   [fabrication](https://github.com/paulelliott/fabrication)

测试夹具生成

-   [ffaker](https://github.com/EmmanuelOga/ffaker)

最快的假数据生成器

-   [database\_cleaner](https://github.com/bmabey/database_cleaner)

测试数据库清空工具

-   [guard](https://github.com/guard/guard)

监控文件变化的事件并触发任务，有大量扩展，非常适合运行spec

-   [guard-rspec](https://github.com/guard/guard-rspec)\

rspec的guard插件

-   [guard-spork](https://github.com/guard/guard-spork)\

让guard集成DRb server：spork，预加载测试环境可以节省大量的测试时间

-   [guard-jasmine](https://github.com/netzpirat/guard-jasmine)

jasmine的guard插件，使用phantomjs做无头浏览器测试

-   [guard-livereload](https://github.com/guard/guard-livereload)\

livereload的guard插件，自动刷新浏览器

* * * * *

#### Rails Auth

-   [devise](https://github.com/plataformatec/devise)

用户注册登录，身份验证的整套解决方案

-   [omniauth](https://github.com/intridea/omniauth)

实现第三方登录认证，包括Twitter，Facebook，微博等等

-   [cancan](https://github.com/ryanb/cancan)

为不同用户设定不同级别的权限

* * * * *

#### Rails Frontend

-   [coffee-rails](https://github.com/rails/coffee-rails)

Rails默认使用coffeescript生成javascript

-   [jquery-rails](https://github.com/rails/jquery-rails)

Rails默认的javascript框架jQuery

-   [backbone-on-rails](https://github.com/meleyal/backbone-on-rails)

最热门的Javascript MV\*框架backbone

-   [sass-rails](https://github.com/rails/sass-rails)

Rails默认使用sass代替css

-   [compass-rails](https://github.com/chriseppstein/compass)

最强大的CSS编程框架Compass，基于sass

-   [bootstrap-sass](https://github.com/thomas-mcdonald/bootstrap-sass)

CSS样式库Twitter Bootstrap的sass移植

-   [slim](http://slim-lang.com)

比Haml更清晰和更快的模板引擎

-   [kaminari](https://github.com/amatsuda/kaminari)

最好的分页控制器

-   [simpleForm](https://github.com/plataformatec/simple_form)

比起Rails默认的Form更简洁和更强大的表单控制器

-   [client\_side\_validations](https://github.com/bcardarella/client_side_validations)

读取服务端Model的验证逻辑并生成对应的客户端验证逻辑，做到DRY

* * * * *

#### Rails Backend

-   [mongoid](https://github.com/mongoid/mongoid)

Mongo ORM

-   [nokogiri](http://nokogiri.org/)

HTML解析器

-   [capistrano](https://github.com/capistrano/capistrano)

远程部署工具

-   [carrierwave](https://github.com/jnicklas/carrierwave)

文件上传管理，支持各类ORM，还可以支持各云平台的存储

-   [sunspot](https://github.com/sunspot/sunspot)

基于SOLR的全文检索引擎

-   [resque](https://github.com/defunkt/resque)

将任务放入后台队列执行

-   [whenever](https://github.com/javan/whenever)

编写和部署Cron

-   [grape](https://github.com/intridea/grape)

创建REST API

* * * * *

#### Rails Misc

-   [rails\_best\_practices](https://github.com/railsbp/rails_best_practices)

控制代码质量的优秀工具

-   [active\_admin](https://github.com/gregbell/active_admin)

为Rails项目创建后台管理界面，非常强大的可定制UI

* * * * *

#### Ruby General

-   [pry](http://pry.github.com/)

比起默认的IRB shell更强大的终端调试工具

* * * * *
