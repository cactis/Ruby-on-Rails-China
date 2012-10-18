---
layout: post
title: "Ruby和元编程的故事 - 第0回: 欲练神功，必先自废武功"
date: 2012-10-17 22:04
comments: true
categories: Ruby-China
author: hisea
---
转载自[Ruby-China](http://ruby-china.org/topics/1171)
[http://hisea.me/p/ruby-story-ep0](http://hisea.me/p/ruby-story-ep0)

#### 开篇

随着Ruby/Rails的逐渐火热，越来越多的开发人员转向Ruby.\
\
 Rails简单易用，很多其他语言开发人员很快就做出简单的Web App.\
\
 然而另一方面，Ruby做为一个语言，确需要一些学习和研究才能掌握其方方面面.\
\
 本系列就是专注于提供一些关于Ruby语言和其元编程技巧的文章。\
 在编写这个系列文章的时候，Hisea对读者做了以下的一些假设:

-   已经熟悉用某种程序些程序
-   已经熟悉Ruby
-   已经能够假设Ruby环境并可以运行代码

#### Ruby是个神马语言

Ruby是一个开源的动态类型，强类型，动态的，面向对象的解释型语言.

看上去貌似很麻烦，这些形容词拿出来一个一个解释就很简单了。

-   开源的:\
    \
     Ruby开源协议1.9.3以前是GPLv2和Ruby, 1.9.3之后是Simplfied
    BSD和Ruby协议

-   动态类型：\
    \
     类型的检查是运行时进行的,
    相对于Java等静态类型语言，类型检查是在编译时进行的

-   强类型语言:\
    \

    不同数据类型在操作和运算中出现混用时，除非显示转换类型，否则会报类型错误，相对于JavaScript等弱类型语言，不存在类似的限制.

-   动态语言:\

    动态语言的定义还很模糊，很多人把动态语言跟动态类型语言搞混，对于Hisea来说，动态语言就是类，方法，及其他定义可以在运行时进行改变，元编程就是利用这一特性。由此可见，动态语言跟动态类型语言并不是一个概念.

-   面向对象：\
    \
     不解释

-   解释型：\
     区别于编译型语言.

#### 欲练盖世神功，必先自废武功

Ruby的动态特性跟以往的静态类型语言相比，需要很多思维上的转换。\
\
 如果带着以往的静态语言思维来学习Ruby,往往需要走些弯路。\
\

对于有其他语言基础的初学者，有些已经练好的武功最好一开始彻底忘掉，才能更好的练成盖世Ruby神功。

下面是一些学习Ruby需要深刻在心的概念，很多可能跟你现有的思维定式相违背。最好的办法就是清空现有想法，不带偏见的从0开始学习Ruby.

#### 0.万物皆是对象

Ruby里的一切，一切一切，无论是色还是空，都是对象。\

不象Java,Ruby没有原始类型。1是对象，1.2是对象，nil是对象，true/false是对象。\
 类是对象，module也是对象。

#### 1.拥抱动态类型

Ruby界有条谚语，如果你扭的像个鸭子，叫的像个鸭子，你就是个鸭子。\
\
 这是Ruby Duck
Typing的特性。看上去很简单，但是真正把这句话融入到骨髓却不是件易事。如果你在代码中有很多检查类型的判断，例如is\_a,
kind\_of等方法，甚至太多的nil检测，都是没有很好的理解动态类型的特征。

#### 2.忘记静态的类设计

这一条其实是第一条的延续。很多有多年Java或者C++/C\#经验的开发人员(包括Hisea自己)，在设计复杂的系统时，都会很自然的想到继承和接口(Interface).在Ruby中设计继承时需要认真的思考一下几个问题。

1.  父类在做什么？ 例如很多人喜欢这么做：

<!-- -->

    class 飞行器  
      def 起飞  
        fail "子类包含具体的实现!"   
      end  
    end  

    class 飞机 < 飞行器  
      def 起飞  
        #飞机起飞实现 
      end  
    end  

    class 热气球 < 飞行器  
      def 起飞  
        #热气球起飞实现  
      end  
    end  

但看以上的例子，父类的作用仅仅是定义了API的存在，这在Java中是非常常见的，可是在Ruby中，这个父类其实存在的意义不是特别大。Ruby更倾向于,任何能起飞(拥有‘起飞’方法)的对象都是飞行器，而不是任何继承飞行器的类的对象。

1.  需要用继承分享代码么？ ActiveRecord需要你继承ActiveRecord::Base,例如:

<!-- -->

    class Post < ActiveRecord::Base  
    end

Hisea本人觉得类似Mongoid的Mixin方式更适合解决类似的问题。
Post从设计逻辑上来讲,跟ActiveRecord::Base没有半毛钱关系。继承关系完全用于分享代码，而在Ruby中，更好的分享代码的办法是用Mixin.\
\
 比如第一个例子中，我们可以定义一个飞机的module,实现 起飞
方法，任何include起飞的类，都是某一种飞机。

#### 3.让动态进行到底

Ruby不仅仅是类型是动态的，还有很多其他的也很动态，比如可以动态的include或者extend一个module,可以动态的定义或者重新定义一个类，或者一个方法。这在Java等静态语言来看是非常的无组织无纪律极其自由散漫。Hisea面试Ruby程序员时经常会问到关于Metaprogramming的问题，其实对Ruby元编程这个特性懂多懂少并无所谓，只是拿来刺探Ruby经验多少的一个问题。资历尚浅的Ruby程序员对于元编程总会抱有这样那样的保守想法。

#### 4,忘记UML(或其他)设计大法

这个话题是3的继续，公司新招了一个Ruby程序员，他来了一两个星期后问了个问题，问为什么公司(或者其他Ruby程序员)不爱用UML之类的设计工具，当时我也一时找不出答案，后来开车回家的路上用半个小时想明白了，UML是一个类只见关系的静态表示，Ruby运行时的情况却是不停在变幻。用静态去表示动态，自然捉襟见肘。

#### 5.为什么不用IDE?

很多从Java阵营转来，尤其是有多年eclipse经验的Ruby初学者尤其是经常爱问，Ruby用什么IDE。\
\
 得到的回答往往是text mate,vim,sublime text 2等等文本编辑器。\
\

很多人可能纳闷，为什么Ruby/Rails没有一个IDE占领大片江山的情况，为什么Netbeans／Eclipse再Ruby开发阵营中没有其他语言开发占的地位重要。

其实答案很简单。

1.  IDE最讨喜的功能是什么？\
    \

    很多用惯了IDE开发的Java程序员甚至XCode程序员，都会说最爱的功能是代码不全，object之后按一下'.'立马生成一个方法列表。转到Ruby用文本编辑器，没有这个功能，很是郁闷。其实道理很简单，如果方法都是动态生成的，在写程序的时候怎么能给出一个列表呢。

2.  Debugger还是必要工具么？\
    \
     静态语言开发，调试是居家旅行杀人灭口必备良药。而IDE又是调试的好帮手。\
     Ruby／Rails的Debugger还没那么成熟，而且如果用logger,
    raise在适当的地方输出inspect,
    to\_yaml等内容，也可以很容易的找到错误。

3.  Eclipse可以很好的配置Java开发环境。\
     Ruby/Rails有好用的RVM,RubyGems,Bundler.

所以，不补全，不调试，不配环境，要IDE不也是拿来当文本编辑器用么。

#### 本回完

零零总总的想了些Ruby的主要特性，以及常见的初学者的疑问/误区。\
\

本文打算从这里开始，写点Ruby深层次的一些概念和特性，并且怎么利用这些特性进行Metaprogramming.

#### 且听下回分解

下回注重一些对象Object的故事。

#### 联系作者

如果你有任何问题，欢迎讨论。

作者: Hisea\
\
 web: [http://hisea.me](http://hisea.me)\
\
 email: zyinghai@gmail.com\
\
 weibo: [http://www.weibo.com/zyinghai](http://www.weibo.com/zyinghai)\
\
 twitter: [https://twitter.com/zyinghai](https://twitter.com/zyinghai)\
\
 github: [https://github.com/hisea](https://github.com/hisea)

Hisea.me 版权所有
