---
layout: post
title: "一起来动手写个gem"
date: 2012-10-17 22:04
comments: true
categories: Ruby-China
author: camel
---
转载自[Ruby-China](http://ruby-china.org/topics/1178)
让我们一起来写个gem，上传到[http://rubygems.org](http://rubygems.org)
供别人调用，并把源码放到github上托管。

今天整了个bootstrap
2.0的gem，非常纯净，如果你讨厌一些gem恶心的DSL，可以试下我的：\
[https://github.com/camsong/mini-bootstrap-rails](https://github.com/camsong/mini-bootstrap-rails)

把大致方法记录一下，供大家参考，欢迎批评 XD

以创建一个名为new\_gem的gem为例。

1、注册一个[https://rubygems.orghttp://github.com帐号。不懂问老师。](https://rubygems.orghttp://github.com%E5%B8%90%E5%8F%B7%E3%80%82%E4%B8%8D%E6%87%82%E9%97%AE%E8%80%81%E5%B8%88%E3%80%82)和

2、生成gem文件

    $ bundle gem new_gem
          create  new_gem/Gemfile
          create  new_gem/Rakefile
          create  new_gem/.gitignore
          create  new_gem/new_gem.gemspec
          create  new_gem/lib/new_gem.rb
          create  new_gem/lib/new_gem/version.rb
    Initializating git repo in /Users/camel/new_gem

3、编码。\
 打开new\_gem.gemspec，这个文件里面都是这个gem的一些说明。\
 找到

    s.summary     = %q{TODO: Write a gem summary}
    s.description = %q{TODO: Write a gem description}

去掉其中的TODO，可先改为

    s.summary     = %q{"just for test"}
    s.description = %q{"just for test"}```

    代码尽量都放到lib/目录下。这里暂不编码。

    4、发布gem到rubygems

\$ gem build new\_gem.gemspec\
 WARNING: no homepage specified\
 WARNING: description and summary are identical\
 Successfully built RubyGem\
 Name: new\_gem\
 Version: 0.0.1\
 File: new\_gem-0.0.1.gem

    会在当前目录下生成new_gem.gem

    5、发布gem到rubygems.org

gem push new\_gem-0.0.1.gem

    然后根据提示输入rubygems.org的用户信息就ok了。

    6、在github上新建一个repository，名字尽量保持一致，所以我们取为new_gem。
    这一步一定要在网页上操作。创建完成后会有一个全是命令的页面。
    其中应该包括：

git init\
 touch README\
 git add README\
 git commit -m 'first commit'\
 git remote add origin git@github.com:camsong/aaaaaaaa.git\
 git push -u origin master

    7、其实就是git上传代码而已。

git add .\
 git commit -m 'first commit'\
 \#git remote add origin git@github.com:camsong/new\_gem.git\
 git remote add origin
[https://github.com/camsong/new\_gem.git](https://github.com/camsong/new_gem.git)\
 \#我喜欢下面这种https的形式，上面是ssh的方式。注意两都如何转换。\
 git push -u origin master

    8、当代码更新后
    先修改/lib/new_gem/version.rb，增加版本号。
    然后重新执行4，5步来更新rubygems.org
    执行第7步来更新github

    Enjoy!
    来杯coffee，一些搞定了。
    以后就可以在Gemfile中添加gem 'new_gem'来引用了。

    原文在： http://rubyer.me/blog/1491

    参考：
    http://blog.xdite.net/posts/2012/01/04/how-to-pack-a-gem/
    http://asciicasts.com/episodes/245-new-gem-with-bundler
