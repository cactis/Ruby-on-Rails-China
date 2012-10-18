---
layout: post
title: "Rails快速实现markdown和代码高亮"
date: 2012-10-17 21:53
comments: true
categories: Ruby-China
author: hisea
---
转载自[Ruby-China](http://ruby-china.org/topics/474)
还是先做个广告： [http://hisea.me](http://hisea.me)

Markdown是时下很流行的一种标记语言。

可以很简便的生成html代码，github的README就是用这种形式显示再代码目录的下面。

Ruby/Rails借助繁多的Gem,可以迅速的就做好markdown的支持，顺道包含对代码高亮的支持。

Gem太多，实现方法也太多。

下面就介绍一种比较迅速开发的办法。用了redcarpet和CodeRay两个Gem。这也是hisea.me用的办法。

首先，安装GEM

    gem 'redcarpet'
    gem 'coderay'

接下来，打开app/helper/application\_helper.rb， 添加下列代码。

      def markdown(text)
        options = {   
            :autolink => true, 
            :space_after_headers => true,
            :fenced_code_blocks => true,
            :no_intra_emphasis => true,
            :hard_wrap => true,
            :strikethrough =>true
          }
        markdown = Redcarpet::Markdown.new(HTMLwithCodeRay,options)
        markdown.render(h(text)).html_safe
      end

      class HTMLwithCodeRay < Redcarpet::Render::HTML
        def block_code(code, language)
          CodeRay.scan(code, language).div(:tab_width=>2)
        end
      end

解释下上面的代码。\
 第一步是添加了一个markdown方法，配置了一些显示方面的细节，比如autolink,
hard\_wrap之类的。

    markdown = Redcarpet::Markdown.new(HTMLwithCodeRay,options)
    markdown.render(text).html_safe

这一步用了一个我们自己定义的HTMLwithCodeRay的Render类来创建一个新的markdown对象，\
 然后用这个自定义类来解析传进来的字符串。

      class HTMLwithCodeRay < Redcarpet::Render::HTML
        def block_code(code, language)
          CodeRay.scan(code, language).div(:tab_width=>2)
        end
      end

最后就是这个自定义类，里面就重写了一个方法。当我们遇到block\_code的时候，转交给CodeRay来生成高亮。

然后就没了。。。\
 迅速吧。
