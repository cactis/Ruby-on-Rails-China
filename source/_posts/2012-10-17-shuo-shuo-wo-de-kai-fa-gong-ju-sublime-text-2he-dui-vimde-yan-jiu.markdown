---
layout: post
title: "说说我的开发工具Sublime Text 2和对Vim的研究"
date: 2012-10-17 22:56
comments: true
categories: RubyChina
author: ery
---
转载自[Ruby-China](http://ruby-china.org/topics/3822)
刚才看见\<\<为什么你们用Vim和Textmate而不用IDE\>\>\
[http://ruby-china.org/topics/622](http://ruby-china.org/topics/622)

很惊讶，这个帖子还没有沉，\
 但是又想了想，当时这个帖子对自己的帮助。\
 觉得其实还是不沉的好，\
 因为这个社区，毕竟还有很多新人。\
 于是写了一些回复，发现写了很多，\
 于是想新建一个帖子吧，\
 说说我现在的开发工具-Sublime\
 以及那个Vim。\
 我的系统是Ubuntu 10.10（等忙过这段换12.04）。

#### 关于 Sublime（Sublime Text 2）

最近六个月，\
 我一直在用Sublime做Rails开发\
 我爱死Sublime啦，\
 Sublime最让人满意的是，\
 速度极快，编码的时候，感觉非常的流畅。

以下是 [*@*camel](/camel "@camel") 曾经提到的四个问题：

*1、代码自动完成*\
 Sublime的自动完成功能很不错，\
 而且支持Snippet

不过，没有大型IDE中的那种“函数名自动提示“的效果，\
 就是，变量名后面，输入个点，\
 就自动列出所有可以使用的函数。\
 对于，Ruby这种动态语言，\
 想实现这种效果，开发成本太高了。\
 我不奢望啦。

*2、查看源码*\
 我用CTags实现查阅源码\
 Sublime有CTags的插件\
 如果你之前和我一样，\
 没用过CTags的话，\
 那么先google一下CTags吧。

*3、Debug*\
 我不知道Sublime中，\
 如何做Rails或者Ruby的debug。\
 但是我用Pry做Debug（感谢[*@*gene\_wu](/gene_wu "@gene_wu")的推荐）\
 用Pry做Debug真的很爽

*4、速度*\
 Sublime非常流畅

以下是我常用的组件

Package Control\
 Alignment\
 Simple Rails Navigator\
 Rails Related Files\
 CTags\
 Coffeescript\
 RubyTest

#### 关于 Vim

我用Vim只有一年的时间，\
 我对Vim不是很熟悉，\
 只会一些最基本的用法，\
 而且主要是在ssh登录服务器的时候使用，\
 在桌面环境下，我用Gedit，或者其他编辑器。

我用了将近一个月的时间，\
 研究了一下，使用Vim进行开发Rails。\
 我在Vim中安装了不少的组件，\
 我发现，\
 需要做太多的配置，\
 需要记住太多的快捷键，

最后，\
 我在使用Vim开发Rails的时候，\
 依然感觉很吃力，依然不是很顺畅。

由于，工作和时间的原因，\
 我决定，暂时不再投入大量的时间研究Vim。\
 我决定，利用今后用琐碎的时间继续研究。

最后，\
 我的结论是，\
 用Vim做为Rails的开发工具，\
 入门成本有点高，\
 要想达到熟练的程度，需要太多的时间。\
 我投了一个月，没达到理想效果。

最后，\
 我又还是回到了Sublime中。\
 我很庆幸，Ubuntu中有Sublime。\
 稍后，有时间我一定会去买一个序列号。\
 我不希望Sublime的开发因为资金的原因停止。\
 目前我们的开发团队严重依赖Sublime。

所以，\
 我推荐大家使用Sublime，\
 如果你觉得好，\
 那么我建议你也买个序列号。
