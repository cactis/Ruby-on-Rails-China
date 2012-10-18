---
layout: post
title: "Ruby和元编程的故事 - 第1回: 色色空空，万物皆为对象"
date: 2012-10-17 22:07
comments: true
categories: Ruby-China
author: hisea
---
转载自[Ruby-China](http://ruby-china.org/topics/1311)
[http://hisea.me/p/ruby-story-ep1](http://hisea.me/p/ruby-story-ep1)

#### 开篇

空即是色，色即是空。\
 空空色色，色色空空，在Ruby语言中，万物皆为对象。

Ruby是一个面向对象的语言(Object Oriented
Language)，面向对象的概念比其他语言要贯彻的坚定很多。

Ruby中不存在Java中原始类型数据和对象类型数据之分。大部分Ruby中的的东东都是对象。

所以，想要掌握Ruby和Ruby的元编程,对象就是第一门必修功课。本回就着重研究一下Ruby中的对象.

#### Ruby中的对象

如果你从其他面向对象的语言转来，一提到得到一个对象你可能会想到建立一个类，然后建立这个类的实例出来产生一个对象。

在Ruby中这完全是可以的，不过这种先建立类才能获得对象的过程，听起来更像是面向类的设计，而不是面向对象的设计。关于类的一些东西放到下回再说。

在Ruby中，不存在原始类型的概念，1, 0.3, true/false 甚至
nil都是对象。比如，你可以在irb中尝试下面的代码：

    >> 1.methods
    => ["%", "odd?", "inspect", "prec_i", "<<", "tap", "div", "&", "clone", ">>", "public_methods", "__send__", "instance_variable_defined?", "equal?", "freeze", "to_sym", "*", "ord", "lcm", "+", "extend", "next", "power!", "send", "round", "methods", <…more methods…> "is_a?", "ceil", "[]"]
    >> 1.class
    => Fixnum

你可以在irb中尝试一下其他数据类型，看看他们的方法和类等等信息。

不只是各种数据类型，方法在Ruby中也是对象， 比如下列例子：

    >> one_plus = 1.method(:+)
    => #<Method: Fixnum#+>
    >> one_plus.class
    => Method
    >> one_plus.call(2)
    => 3

有意思的是，方法对象也是有方法的：

    >> one_plus.arity()
    => 1

#### 对象到底是什么？

到底什么是对象呢？

简单的说，**对象就是 状态 ＋ 行为**

**状态**
就是表明当前对象所拥有的属性，每个同类的对象可能有不同的状态，这些状态保存在实例变量里面(Instance
Variable).\
\

对象的实例变量可以由instance\_variable\_set／instance\_variable\_get来设定／读取：

    >> 1.instance_variable_set(:@my_var, "world")
    => "world"
    >> 1.instance_variable_get(:@my_var)
    => "world"

**行为**
行为就是作用在对象上的动作，就是我们常说的方法。Ruby方法的调用，类似于smalltalk或者Objectiv-C，采用消息模式。调用方法相当于对这个对象发送了一个消息。所以对方法的调用也可以这样：

    >> 1.send(:+,1)
    => 2

在Ruby中，状态，也就是实例变量是保存在对象里的，而行为或方法则是存在于对象的类或者mixin的module里面。

在静态语言中，编译时就会确定所调用的方法是否存在，不存在会产生编译错误。

Ruby中，当我们在方法调用的运行时，对象会查找他隶属的类，module,父类等，来找到相对应的方法。

#### Singleton/Meta/Anonymous/Ghost/Shadow Class

-   Singleton Class: 单例类
-   Meta Class：元类
-   Anonymous Class: 匿名类
-   Ghost Class：鬼类
-   Shadow Class: 影子类

上面的这些东东其实说的都是一个东西，我喜欢叫它 影子类。

Ruby中每一个对象都一个一个影子类，这个影子类存在于对象跟它所属的类之间：

对象("obj1") -\> 影子类 -\> 对象所属的类(String)

当一个对象的方法被调用时，首先查找的是影子类，之后才是它所属的类。

上面讲到实例变量存在于对象内，方法存在于对象的类中。\

影子类上的方法，就是只有这一个对象拥有的方法。这个方法通常叫做单例方法(Singleton
Method)。

这样的方法只存在于这个对象上，同一个类的其他对象没有这个方法，因为他们的影子类不同，其他对象的影子类上没有这个方法。

    >> a = "obj1"
    => "obj1"
    >> def a.hello
    >> puts "hello world"
    >> end
    => nil
    >> a.hello
    hello world
    => nil
    >> b = "obj2"
    => "obj2"
    >> b.hello
    NoMethodError: undefined method `hello' for "obj2":String
        from (irb):49
    >> a.singleton_methods
    => ["hello"]
    >> b.singleton_methods
    => []

#### Self

Ruby里面一切都是对象，self也是对象，确切地说是当前对象的引用。

前文说Ruby的方法调用是消息模式，比如obj.method,
消息的接受者是.之前的对象，.之后的是方法及参数。\

如果对象和.没有出现的话，消息会被默认送到self对象。除了作为方法的默认接受者，self也是实例变量的解析对象。

self在ruby一开始的时候，被设定为一个叫做main的对象，再irb里面可以看到：

    >> m = self
    => main

self可以被认为是一个特殊的变量，它的特殊性在于，你不能给他赋值:

    >> self = "obj"
    SyntaxError: compile error
    (irb):77: Can't change the value of self
    self = "obj"
          ^

有几个办法可以改变self的值，.(obj.method的.)是其中一个，除了.还有class/module关键字。\
 本回主要关注跟对象相关的.

当我们用obj.method调用方法时，接下来的时间代码的执行就会到相应的方法里，运行的上下文切换到那个对象，self自然也变成了那个对象。用def定义单例方法时，道理也是相通的。
下面的例子可以说明这个self切换的情况。

    >> a = "obj"
    => "obj"
    >> def a.hello_self
    >> puts "hello #{self}"
    >> end
    >> m = self
    => main
    >> a.hello_self
    hello obj

#### 对象的复制

前文说对象的存在包括两部分，一是状态/实例变量，另一个是行为，本回专注讲了单例方法和影子类。\
 Ruby中对象的复制也有两种模式，一个是只复制当前的状态/实例变量
dup。另外一种是连同影子类和引用的对象一起复制，从而把单例方法也复制一份。

    >> a = "obj"
    >> def a.hello_self
    >> puts "hello #{self}"
    >> end
    >> b = a.dup
    => "obj"
    >> b.hello_self
    NoMethodError: undefined method `hello_self' for "obj":String
        from (irb):90
    >> b = a.clone
    => "obj"
    >> b.hello_self
    hello obj

其实有本回上述的这些功能，即便是没有class，Ruby也可以作为一种Prototype(类似JavaScript)的面向对象语言了。

你可以建立一个对象，生成默认的实例变量，把行为作为单例方法定以在这个对象的影子类上，然后用clone生成千千万万个实例。当然这样比较麻烦，但却是可行的途径之一。

#### 其他Object API

对象还有很多其他的功能，比如可以freeze,另外dup跟clone也有一些其他的引用上面的区别，dup只复制引用，clone会吧引用的对象也复制。

这些都可以在Object类(Ruby所有对象的父类)API上找到，可以查看[apidock.com的文档](http://apidock.com/ruby/Object)

例如关于dup\
 .dup() produces a shallow copy of obj—the instance variables of obj are
copied, but not the objects they reference. dup copies the tainted state
of obj. See also the discussion under Object\#clone. In general, clone
and dup may have different semantics in descendant classes. While clone
is used to duplicate an object, including its internal state, dup
typically uses the class of the descendant object to create the new
instance.

#### 本回完

本回讲了些对象相关的东西，有的很基础，有的是Ruby自身的一些特性。

其中Ruby对象模型中最具特色的两个特性就是影子类/单例方法和self,最好能深入理解这两个概念。

#### 且听下回分解

下回注重一些关于类的故事。

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
