---
layout: post
title: "method_missing，一个 Ruby 程序员的梦中情人"
date: 2012-10-17 22:49
comments: true
categories: Ruby-China
author: dotnil
---
转载自[Ruby-China](http://ruby-china.org/topics/3434)
小感冒，晕乎乎，翻译一篇文章攒人品，望自己明天生龙活虎

地址：[http://www.alfajango.com/blog/method\_missing-a-rubyists-beautiful-mistress/](http://www.alfajango.com/blog/method_missing-a-rubyists-beautiful-mistress/)\
 标题：method\_missing: \
 A Rubyist’s Beautiful Mistress\
 译者：逸才

我最近读了些文章（比如[这篇](http://rubylearning.com/blog/2010/10/07/do-you-know-rubys-chainsaw-method/)），宣传在
Ruby 里使用 `method_missing` 的。

很多人都与 `method_missing`
干柴烈火，但在并没有小心处理彼此之间的关系。所以，我想来探讨一下这个问题：

\*\* 我该怎么用 `method_missing` \*\*

什么时候该抵挡 `method_missing` 的诱惑

首先，永远不要在还没花时间考虑你用得够不够好之前，就向 `method_missing`
的魅力屈服。你知道，在日常生活中，很少会让你以为的那样亟需
`method_missing`：

日常：方法代理

案例：我需要让这个类能够使用另一个类的方法

这是我所见过最普遍的使用 `method_missing` 的情况。这在 gems 与 Rails
插件里头尤其流行。它的模型类似这样：

    class A
      def hi
        puts "Hi from #{self.class}"
      end
    end

    class B
      def initialize
        @b = A.new
      end

      def method_missing(method_name, *args, &block)
        @b.send(method_name, *args, &block)
      end
    end

    A.new.hi #=> Hi from A
    B.new.hi #=> Hi from A

如此，B 就拥有了 A 的所有实例方法。但是让我们想想，在调用 `@b.hi`
的时候都发生了什么。你的 ruby 环境沿着继承链一路找 `hi`
这个方法，到最后，恰恰在丢出个 `NoMethodError` 前，它调了 `method_missing`
这个方法。

在上例中，情况并不坏，毕竟这里就两个微不足道的类需要查。但通常，我们是在
Rails 或者其他一些框架的上下文中编程。而你的 Rails 模型继承自
`ActiveRecord`，而它又集成自其他一大坨的类，于是现在你就有了一坨高高的堆栈要爬⋯⋯
在你每次调用 `@b.hi` 的时候！

你的好基友：`define_method`

估计现在你在抱怨，“但是史蒂夫，我需要 `method_missing`”
我告诉你，别忘了其实除了情妇之外，你还有个忠诚的好基友，叫做
`define_method`。

它允许你动态地定义一个方法（顾名思义）。它的伟大之处在于，在它执行过之后（通常在你的类们加载之后），这些方法就存在你的类中了，简单直接。在你创建这些方法的时候，也没有什么继承链需要爬。

`define_method` 很有爱很可靠，并且能够满足你的日常生活。不信我？接着看⋯⋯

    class B
      define_method(:hi) do
        @b.hi
      end
    end

“可是我有一大坨方法要定义！” 你抱怨

“没问题！” 我卖萌眨眼

    class B
      [:hi, :bye, :achoo, :gesundheit].each do |name|
        define_method(name) do
          @b.send(name)
        end
      end
    end

可是我懒得把它们一个个写出来！

你有点难搞哦

    class A
      # ... lots of methods in here
    end
    class B
      A.instance_methods.each do |name|
        define_method(name) do
          @b.send(name)
        end
      end
    end

那假如我要定义的方法跟原本的有那么一些些不一样呢？

容易

    class A
      def hi
        puts "Hi."
      end
    end

    class B
      A.instance_methods.each do |name|
        define_method("what_is_#{name}") do
          if @b.respond_to?(name)
            @b.send(name)
          else
            false
          end
        end
      end
    end

    B.new.what_is_hi #=> "Hi."
    B.new.what_is_wtf #=> false

呃，代码看起来不优雅啊

那就没办法了，凑合得了。如果你想要代码更易读，可以看看我们的 [ruby
delegation library](http://railsmagazine.com/articles/4) 和 [Rails
ActiveRecord
delegation](http://www.simonecarletti.com/blog/2009/12/inside-ruby-on-rails-delegate/)。

好，我们总结一下，看看 `define_method` 的真正威力。

修改自 ruby-doc.org 上的
[例子](http://ruby-doc.org/core/classes/Module.html#M001654)

    class A
      def fred
        puts "In Fred"
      end
      def create_method(name, &block)
        self.class.send(:define_method, name, &block)
      end
      define_method(:wilma) { puts "Charge it!" }
    end
    class B < A
      define_method(:barney, instance_method(:fred))
    end

    a = B.new
    a.barney                                #=> In Fred
    a.wilma                                 #=> Charge it!
    a.create_method(:betty) { p self.to_s }
    a.betty                                 #=> B

什么时候用 `method_missing`？

现在你估计在想，总有该用它的时候吧，不然还要它干嘛？没错。

动态命名的方法（又名，元方法）

案例：我要依据某种模式提供一组方法。这些方法做的事情顾名思义。我可能从来没有调用过这些可能的方法，但是等我要用的时候，它们必须可用。

现在才是人话！这其实正是 ActiveRecord
所采用的方式，为你提供那些基于属性的动态构建的查找方法，比如
`find_by_login_and_email(user_login, user_email)`。

    def method_missing(method_id, *arguments, &block)
      if match = DynamicFinderMatch.match(method_id)
        attribute_names = match.attribute_names
        super unless all_attributes_exists?(attribute_names)
        if match.finder?
          # ...you get the point
        end # my OCD makes me unable to omit this
        # ...
      else
        super # this is important, I'll tell you why in a second
      end
    end

权衡利弊

当你有一大堆元方法要定义，又不一定用得到的时候，`method_missing`
是个完美的折衷。

想想 ActiveRecord 中基于属性的查找方法。要用 `define_method`
从头到脚定义这些方法，ActiveRecord
需要检查每个模型的表中所有的字段，并为每个可能的字段组合方式都定义方法。

    find_by_email
    find_by_login
    find_by_name
    find_by_id
    find_by_email_and_login
    find_by_email_and_login_and_name
    find_by_email_and_name
    # ...

假如你的模型有 10 个字段，那就是 10!
（362880）个查找方法需要定义。想象一下，在你的 Rails
项目跑起来的时候，有这么多个方法需要一次定义掉，而 ruby
环境还得把它们都放在内存里头。

老虎·伍兹都做不来的事情。

\*\* 正确的 `method_missing` 使用方式

（译者猥琐地注：要回家了，以下简要摘译）

1、先检查

并不是每次调用都要处理的，你应该先检查一下这次调用是否符合你需要添加的元方法的模式：

    def method_missing(method_id, *arguments, &block)
      if method_id.to_s =~ /^what_is_[\w]+/
        # do your thing
      end
    end

2、包起来

检查好了，确实要处理的，请记得把函数体包在你的好基友，`define_method`
里面。如此，下次就不用找情妇了：

    def method_missing(method_id, *arguments, &block)
      if method_id.to_s =~ /^what_is_[\w]+/
        self.class.send :define_method, method_id do
          # do your thing
        end
        self.send(method_id)
      end
    end

3、擦屁股

自己处理不来的方法，可能父类有办法，所以 `super` 一下：

    def method_missing(method_id, *arguments, &block)
      if method_id.to_s =~ /^what_is_[\w]+/
        self.class.send :define_method, method_id do
          # do your thing
        end
        self.send(method_id)
      else
        super
      end
    end

4、昭告天下

    def respond_to?(method_id, include_private = false)
      if method_id.to_s =~ /^what_is_[\w]+/
        true
      else
        super
      end
    end

要告诉别人，你的类虽然暂时还没有这个方法，但是其实是能够响应这方法的。

\*\* 总结 \*\*

在每个 Ruby 程序员的生活中，这仨方法扮演了重要的角色。`define_method`
是你的好基友，`method_missing` 是个如胶似漆但也需相敬如宾的情妇，而
`respond_to?` 则是你的爱子，如此无虞。
