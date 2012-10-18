---
layout: post
title: "来自 37signals 的 3 个 Rails console 技巧"
date: 2012-10-17 22:50
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/3506)
确实非常实用啊！

1.  用 `app` 来调用 routes，比如 `app.posts_path, app.topic_path(1)`

        irb > app.topics_path
        => "/topics" 
        irb > app.get(app.root_path)
        ......
        => 200 

2.  用 `helper` 来调用 Helper 方法，比如:

        irb > helper.link_to("Ruby China", "http://ruby-china.org")
        => "<a href=\"http://ruby-china.org\">Ruby China</a>" 
        irb > helper.truncate("Here is Ruby China.", length: 15)
        => "Here is Ruby..." 

3.  使用 `source_location` 方法查看方法在那里定义的, 比如:

        irb >Topic.instance_method(:destroy).source_location
         => ["/Users/jason/.rvm/gems/ruby-1.9.3-p0/gems/mongoid-2.4.8/lib/mongoid/persistence.rb", 30] 
        irb >Topic.method(:destroy_all).source_location
         => ["/Users/jason/.rvm/gems/ruby-1.9.3-p0/gems/mongoid-2.4.8/lib/mongoid/persistence.rb", 239]

[http://37signals.com/svn/posts/3176-three-quick-rails-console-tips](http://37signals.com/svn/posts/3176-three-quick-rails-console-tips)
