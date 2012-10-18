---
layout: post
title: "深入Rails3: ActiveSupport::Concern"
date: 2012-10-17 22:48
comments: true
categories: RubyChina
author: hujoy
---
转载自[Ruby-China](http://ruby-china.org/topics/3386)
转自iHower的博客：
[http://ihower.tw/blog/archives/3949](http://ihower.tw/blog/archives/3949)

ActiveSupport::Concern 是 Rails3 做 Modularity
的一個重要的小工具。他的任務是讓管理 modules 之間的 dependencies
變得容易。

假設我們有兩個 Modules 有依存關係，module Bar 依存於 module
Foo，然後有一個宿主 Host 類別希望 include Bar 的功能，我們可以這樣寫:

    module Foo
       # self.included 這個函式會在 Foo 被 include 時執行
        def self.included(base)
            base.send(:do_host_something) # 對宿主做某些操作，例如增強功能等等
        end
    end

    module Bar
        def self.included(base)
            base.send(:do_host_something)
        end
    end

    class Host
      include Foo, Bar
    end

這有個討厭的缺點就是，我們必須在宿主中同時 include Foo 跟
Bar，也就是要把所有依存的 modules 都 include
進來。這很糟糕啊，為什麼我們需要在 Host 裡面知道這些 modules 的依存關係呢
:/

我們希望能夠將 modules 的依存關係寫在 module 中，而宿主 Host
就只要使用就好了。所以我們試著改寫成:

    module Bar
      include Foo # 因為 Bar 依存於 Foo，所以我們在這裡 include 它

      def self.included(base)
        base.send(:do_host_something)
      end

    end

    class Host
      include Bar # 只要 include Bar 就好，不需要知道 Bar 還依存哪些 modules
    end

這樣乍看之下好像沒問題，但是卻有個嚴重的問題導致無法執行，因為 Foo
變成是由 Bar 所 include，所以對 Foo 的 self.included 來說，他的參數 base
變成了 Bar 了，所以他就沒辦法存取到宿主 Host
的任何函式及變數，do\_host\_something 時就會失敗。

Okay，ActiveSupport::Concern
就是來幫助解決這個難題，我們希望宿主可以不需要知道 modules 之間的
dependencies 關係。dependencies 關係寫在 module 裡面就好了。

    require 'active_support/concern'

    module Foo
        extend ActiveSupport::Concern
        included do
            self.send(:do_host_something)
        end
    end

    module Bar
        extend ActiveSupport::Concern
        include Foo # 因為 Bar 依存於 Foo，所以我們在這裡 include 它

        included do
            self.send(:do_host_something)
        end
    end

    class Host
      include Bar # 只要 include Bar 就好，不需要知道 Bar 還依存哪些 modules
    end

如此就搞定了。One more thing，如果你有定義 module ClassMethods 和 module
InstanceMethods 在裡面的話，它也會自動幫你載入到宿主裡面去，就不用自己寫
send(:include, InstanceMethods) 跟 send(:extend, ClassMethods)
了。用法舉例：

    module Foo
        extend ActiveSupport::Concern
        included do
            self.send(:do_host_something)
        end

       module ClassMethods
          def bite
            # do something
          end
       end

       module InstanceMethods
          def poke
             # do something
          end
       end
    end

想知道 ActiveSupport::Concern 到底怎麼實作的話，請看
/activesupport/lib/active\_support/concern.rb，只有 29 行，而且
ActiveSupport::Concern 也沒有再依存其他東西了，嘿。
