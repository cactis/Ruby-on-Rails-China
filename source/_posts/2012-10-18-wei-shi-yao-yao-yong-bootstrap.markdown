---
layout: post
title: "为什么要用 Bootstrap"
date: 2012-10-18 11:40
comments: true
categories: Ruby-China
author: linlis
---
转载自[Ruby-China](http://ruby-china.org/topics/4168)
[Bootstrap](http://twitter.github.com/bootstrap/) 是由两个 twitter
员工开发并开源的前端框架，目前已经到了 2.0.4 的版本，在
[Github](https://github.com/twitter/bootstrap/) 上面有 32517个 watch，和
6608个
fork。非常火爆，而如此火爆自然有它的道理，在我们团队的所有项目中正全面推行使用
Bootstrap，我想根据自己的实际使用体验来说明一下为什么要用 Bootsrap。

#### twitter 出品

首先，Bootstrap 出自
twitter，大厂出品，并且开源，自然久经考验，减少了测试的工作量。站在巨人的肩膀上，不重复造轮子。

同时，Bootstrap 的代码有着非常良好的代码规范，从中也可以学习到很多，在
Bootstrap 的基础之上创建项目，日后代码的维护也变得异常简单清晰。

#### 基于 Less、丰富的 Mixin

如果你不知道 [Sass](http://sass-lang.com/) 或者
[Less](http://lesscss.org/) 这样的 CSS
预处理技术，我只能说你实在太落伍了，建议你先去了解之。

Bootstrap 的一大优势就是它是基于 Less 打造的，并且也有
[Sass版本](https://github.com/thomas-mcdonald/bootstrap-sass)
。正因为如此，它一推出就包含了一个非常实用的 Mixin 库任你调用。

举个很简单的例子，当你平时要用到一些 css3
属性的时候，你要写不同的浏览器写不同的 -prefix-，比如圆角 border-radius ：

    -webkit-border-radius: 10px;
        -moz-border-radius:10px;
            -border-radius:10px;

但是通过 Bootstrap 给你预设好的 mixin，你直接写成这样就可以了：

    @include border-radius (10px);

是不是轻松愉快？基本常用的 CSS3 mixin
都帮你整理好了，你都直接调用就可以了，在此不一一举例。 Bootstrap
是目前最好的基于 Less(Sass) 的前端框架，丰富而实用的 Mixin
应该是其最好的地方。

#### 可以 Responsive 的栅格系统

Bootstrap 的 [栅格
(Grid)](http://twitter.github.com/bootstrap/scaffolding.html#gridSystem)
系统也很先进，整个 Grid 系统是可以 Responsive 的！如果你还不知道
[Responsive
Design](http://www.smashingmagazine.com/responsive-web-design-guidelines-tutorials/)，那么你太落伍了，建议你了解之。

Bootstrap 已经帮你搭好了实现 Responsive Design
的基础框架，并且非常容易修改。如果你是一个新手，Bootstrap
可以帮助你在非常短的时间内上手 Responsive Design。

#### 丰富的组件

Bootstrap
的[HTML组件](http://twitter.github.com/bootstrap/components.html) 和
[Js组件](http://twitter.github.com/bootstrap/javascript.html)
非常丰富，并且代码简洁，非常易于修改，你完全可以在其基础之上修改成自己想要的任何样子。这是工作效率的极大提升。

#### 插件

另外、由于 Bootstrap 的火爆，又出现了不少围绕 Bootstrap
而开发的插件。其中最实用的莫过于 [Font
Awesome](http://fortawesome.github.com/Font-Awesome/) 了。它是一套 icon
font，提供了丰富的 icon 给你选择，新的 2.0
版又根据网友的意见增加了70个新的 icon。

在现在一股有 Apple 带领的 Retina
潮流下，对图片的视网膜屏下的解决方案已经变得越来越有必要了，而在 icon
这个东西上，icon font
是完美的解决方案，不用担心分辨率的问题，因为它实际上是字体。

#### 以上

这些就是为什么要用 Bootstrap
的原因，目前市面上没有任何其他框架可以和它相媲美，但是它就虽然是一匹好马，你还是需要花费一些时间去学习它、适应它，它在日后给你带来的便利性是无可比拟的，你会后悔自己为什么没有早点接触它。

#### 一些题外话

#### 我不喜欢用框架，我喜欢原生的写法

这是我在给别人推荐 Bootstrap 的时候最常听到的话，我只能说，Bootstrap
并不能帮你完成所有事情，它只是一个的框架，在这个框架上面你依旧可以任意的发挥，并且发挥得更好，但是前提是你要驾驭得了它。

如果你不够熟悉它，你确实是有时候会被它有所牵绊，但是你熟悉了之后发现了其实它没有对你进行任何限制，这需要一个过程。

#### 是给无设计师的团队或者程序员用的

对此我真的是无力吐槽，Bootstrap
的开发者就在他的博客上抱怨过，为什么出来那么一堆完全照搬 Bootstrap
样式的网站。

记住、完全用 Bootstrap 的样式只会让人心生厌烦。

原文发自我的[博客](http://linlis.me/post/26532096798)，我是一名互联网创业者，我会在我的博客中记录我的创业历程，夹杂了一些生活，欢迎订阅。
