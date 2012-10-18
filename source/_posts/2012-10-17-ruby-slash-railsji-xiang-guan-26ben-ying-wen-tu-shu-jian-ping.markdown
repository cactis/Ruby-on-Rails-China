---
layout: post
title: "Ruby/Rails及相关26本英文图书简评"
date: 2012-10-17 21:57
comments: true
categories: Ruby-China
author: hisea
---
转载自[Ruby-China](http://ruby-china.org/topics/768)
还是先做个广告：
[http://hisea.me/p/ruby-rails-book-list-and-review](http://hisea.me/p/ruby-rails-book-list-and-review)

#### 开始

早就相对现在Ruby/Rails的书做个总结。方便对Rails感兴趣的朋友查找。

因为ruby on
rails的书时效性很强，Ruby语言2007之前跟Rails两年以前的书都没加在这个列表里。

有些特殊的跟设计相关的书例外。

#### Ruby:

#### 入门篇

-   [The Ruby Programming
    Language](http://www.amazon.com/gp/product/0596516177/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0596516177)

Ruby之父"Mats"参与写作的一本书。

很像Ruby的官方书，内容是Ruby每一部分的定义，简洁准确。稍微有点生涩，但是这类书大多是很好的的参考书。

如果你对Ruby有一定的了解，想要重新研究一下某一方面概念，比如Ruby里的Closure。
除了Google可能这本书就是最佳选择了。

-   [Programming Ruby 1.9: The Pragmatic Programmers'
    Guide](http://www.amazon.com/gp/product/1934356085/ref=as_li_tf_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1934356085)

著名的斧头书，很多人把这本书作为Ruby入门的标准教材。内容覆盖很全面。

虽然这本书看上去很厚，但是后一半是Ruby
API。语言上更为流畅，建议这本书入门，上面那本书速查。

-   [Beginning Ruby: From Novice to
    Professional](http://www.amazon.com/gp/product/1430223634/ref=as_li_tf_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1430223634)

这本书分三部分，第一部分使一些基础知识，第二部分侧重Ruby语言，最后一部分简略介绍了ruby在web,网络，GUI方面的应用，以及一部分的Gem。

如果你第一次接触Ruby，可一看一下这本书，如果已经看了其他的ruby的书，这本书除了第三部分一些内容可能帮助不是特别大。

-   [The Book of Ruby: A Hands-On Guide for the
    Adventurous](http://www.amazon.com/gp/product/1593272944/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1593272944)

这是一本2011年7月出的书，我看了他们免费的第十一章，关于Symbol的，给我的感觉是这本书的代码实例比较多。

喜欢通过代码学习的同学可以尝试一下这本书。

#### 进阶篇

-   [Eloquent
    Ruby](http://www.amazon.com/gp/product/0321584104/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321584104)

如果你刚看完一本Ruby入门教材，这是首选的第二本书。

这本书主要介绍了Ruby的开发风格，常用模式。一开始是Ruby基本话题，到后面是Metaprogramming最后由DSL的开发终结。

每一章除了内容之外，都有注意要点，和实际开源项目中的例子，讲解本章内容怎么在实际项目中应用的。

-   [The Well-Grounded
    Rubyist](http://www.amazon.com/gp/product/1933988657/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1933988657)

另一本不错的进阶书，跟Eloquent
Ruby相比更侧重基础知识，对Metaprogramming的覆盖较少。

如果你有不错的编程基础，也可以把这本书作为入门书，入门类的图书对于有经验的程序员来说经常略显浅显。

-   [Metaprogramming Ruby: Program Like the Ruby
    Pros](http://www.amazon.com/gp/product/1934356476/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1934356476)

本书通过一个程序员5天的开发经历，介绍Metaprogramming的一些要点。

是不错的学习Metaprogramming的教材，可是因为角色扮演的语言太多，作为参考的时候不太容易立马找到要点。

建议读这本书的时候做笔记，以便以后重温实用。

-   [Refactoring: Ruby
    Edition](http://www.amazon.com/gp/product/0321603508/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321603508)

我们公司Ruby工程师必读图书。

如果需要重构，强烈建议阅读。

如果不需要重构，也强烈建议阅读，以便找到需要重构的地方。

-   [Design Patterns in
    Ruby](http://www.amazon.com/gp/product/0321490452/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321490452)

如果你对设计模式感兴趣，这是另一本强烈建议阅读的书。

-   [Ruby Best
    Practices](http://www.amazon.com/gp/product/0596523009/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0596523009)

相对较老的一本书。这本书主要是针对一些Ruby一些实用技巧及在实际情况下的应用。

如Ruby method
API设计的最佳实践，动态特性和Metaprogramming的应用，函数式语言特性及文本处理等等。

如果感兴趣也是一本不错的课后读物。

#### Rails:

#### 入门篇

-   [Ruby on Rails 3 Tutorial: Learn Rails by
    Example](http://www.amazon.com/gp/product/0321743121/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321743121)
    入门选择1,跟着例子学Rails.

网上可以免费阅读：[http://ruby.railstutorial.org/ruby-on-rails-tutorial-book\#sec:comments\_for\_various\_readers](http://ruby.railstutorial.org/ruby-on-rails-tutorial-book#sec:comments_for_various_readers)

-   [Agile Web Development with
    Rails](http://www.amazon.com/gp/product/1934356549/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1934356549)

入门选择2,
前半部分是跟着学Rails，后半部分有Rails各部分的应用介绍。建议选择最新版。

-   [Rails 3
    Way](http://www.amazon.com/gp/product/0321601661/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321601661)

这本书不跟任何项目，适合参考，覆盖面广。

相对前两个，这本书更适合有一定Rails基础的人。

#### 进阶篇

-   [Rails 3 in
    Action](http://www.amazon.com/gp/product/1935182277/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1935182277)

Rails Core Team成员Yahuda
Katz写的书，对Rails有一定了解的也可以用这本书入门。

这是2011年9月出的一本书，是为数不多的Rails 3.1的书之一。

-   [Rails Recipes: Rails 3
    Edition](http://www.amazon.com/gp/product/1934356778/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1934356778)

2012年2月将要出版的一本书，菜谱书系列。适合拿来参考怎么用Rails解决某一类问题。

-   [Crafting Rails Applications: Expert Practices for Everyday Rails
    Development](http://www.amazon.com/gp/product/1934356735/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1934356735)

Rails Core Team成员Jose Valim写的书。很多Rails进阶技巧和概念。

高手必读，初学勿看。

-   [Rails AntiPatterns: Best Practice Ruby on Rails
    Refactoring](http://www.amazon.com/gp/product/0321604814/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321604814)

一本关于Rails重构的书，列举了很多Rails的最差实践，并提出解决方案。

是很好的进阶读物，避免一些常见问题。

-   [Service-Oriented Design with Ruby and
    Rails](http://www.amazon.com/gp/product/0321659368/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321659368)

对SOA开发感兴趣的强烈建议这本书，有很多关于Rails Web
API开发的有价值内容。

前半部分是一个案例学习和一些Rails API开发的基础知识。

后半部分是每一章都关注一些Rails SOA开发的实际问题，比如安全，消息，Load
Balancing和Caching.

-   [Enterprise
    Rails](http://www.amazon.com/gp/product/0596515200/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0596515200)

这本书虽然相对较老，2008年出版，但很多设计方面的考量可以看一下。

例如Database的Normal Form, Trigger的应用，SOA等。

#### 其他:

下面这些是Ruby相关的一些书，跟Rails关系不是特别大，如果感兴趣可以挑来看看。

-   [Build Awesome Command-Line Applications in Ruby: Control Your
    Computer, Simplify Your
    Life](http://www.amazon.com/gp/product/1934356913/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1934356913)\
     构建很牛的CLI Ruby应用

-   [The RSpec Book: Behaviour Driven Development with Rspec, Cucumber,
    and
    Friends](http://www.amazon.com/gp/product/1934356379/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1934356379)\
     Rspec的书

-   [The Cucumber Book: Behaviour-Driven Development for Testers and
    Developers](http://www.amazon.com/gp/product/1934356808/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1934356808)\
     Cucumber的书

-   [Everyday Scripting with Ruby: For Teams, Testers, and
    You](http://www.amazon.com/gp/product/0977616614/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0977616614)\
     Ruby日常脚本

-   [Wicked Cool Ruby Scripts: Useful Scripts That Solve Difficult
    Problems](http://www.amazon.com/gp/product/B005SNLI3W/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=B005SNLI3W)\
     巨酷Ruby脚本

-   [Ruby by Example: Concepts and
    Code](http://www.amazon.com/gp/product/1593271484/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1593271484)\
     Ruby代码实例

-   [Distributed Programming with
    Ruby](http://www.amazon.com/gp/product/0321638360/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321638360)\
     Ruby分布式编程

-   [Scripted GUI Testing with
    Ruby](http://www.amazon.com/gp/product/1934356182/ref=as_li_qf_sp_asin_tl?ie=UTF8&tag=hiseame-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1934356182)\
     Ruby GUI测试
