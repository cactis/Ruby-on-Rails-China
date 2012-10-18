---
layout: post
title: "大家来贴一下常用的小技巧吧"
date: 2012-10-17 21:55
comments: true
categories: Ruby-China
author: john1king
---
转载自[Ruby-China](http://ruby-china.org/topics/541)
因为是搞前端出生的，学ruby的时候最大感受是内建的方法非常好用，大部分简单的操作都可以一行搞定。不过也因为内建方法比较多，所以很多都是用的时候才查的，目前还不是很熟。时不时看都别人的代码，才发现自己之前写的代码里很多用内建的方法就可以很轻易的搞定，于是每次修改时都可以delete一大段代码...下面举几个例子，希望大家也能贴一贴，相信这类资料应该还是很有用的。

    File.join("lib/","ruby","gem.rb")
    #=> bin/ruby/gem.rb
    # 好处是不用处理斜杠了


    def print_args(a) 
        Array(a).each {|i| print i}
    end
    print_args [1,2,3] #=> 123
    print_args 1 #=> 1
    # 定义灵活的方法参数时经常用到



    %w(a b c).map &:upcase
    #=> ["A", "B", "C"]
    # 可用于代替简单的代码块
