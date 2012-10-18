---
layout: post
title: "Emacs 开发 Rails 应用之 --- 自动补全与 snippet 输入 "
date: 2012-10-17 22:27
comments: true
categories: Ruby-China
author: zw963
---
转载自[Ruby-China](http://ruby-china.org/topics/2046)
应lgn21st之邀, 写一篇有关**Emacs开发Rails应用**的Wiki. 深感任务相当庞大,
\
 好在现在还没有上班, 时间相对充裕. 虽然已经很晚了, 但明天可以睡个懒觉. \
 立即行动, 把这两天的战斗结果记录下来.

这几天突击研究了几天有关Emacs中的自动补全(autocomplete)以及snippet输入.

小有心得, 在同一个快捷键之上(tab),
堪称完美的实现自动补全与snippet插入的功能.

赶紧记下来备忘, 在这里分享给大家.

我认为针对任何其他编辑器, 都应该具有一定的通用性,
从此再也不用为了使用什么样的\
 key来定义snippet发愁了. 很爽\~\~

在Emacs下面, 自动补全使用的插件叫做auto-complete,
snippet插件叫做yasnippet.

你可以在以下github找到最新的软件版本:\
[https://github.com/m2ym/auto-complete](https://github.com/m2ym/auto-complete)\
[https://github.com/capitaomorte/yasnippet](https://github.com/capitaomorte/yasnippet)

首先说下在Emacs以上两个插件中存在的提示菜单, 总共有三种.

其中两种是自动补全(autocomplete)提供的, 而另一种是yasnippet插件提供的.

自动补全有两个菜单:\
 一个是光标后面的阴影, 会告诉你如果按下tab键, 会补全为什么单词.\
 另一个是如果等待0.8秒后, 什么也没做, 弹出一个文本菜单,
这个菜单按照一下优先顺序决定扩展:\
 - 当前模式对应词典\
 - 是否定义对应的snippet\
 - 当前buffer上下文

(注意, 以上两个菜单, 在Emacs中, 可以设定在输入多少个字符后才允许激活,
很明显,\
 我的设定是4个字符, 默认情况下, 这个选项是2)

yasnippet有一个菜单, 只有在使用同样的key, 但是具有不同的name的情况下,
才会弹出这个菜单.\
 用于选择同样的key下的不同的不同的snippet.

例如: 键入 should, 再次键入tab, 会弹出一个snippet菜单,
会有各种should的片段注释,\
 在这里, 你可以根据不同的name, 来选择扩展对应的snippet.

具体的要求是:\
 - 如果键入的字符数量小于等于3个, 此时, 如果存在对应的snippet key. \
 例如存sh扩展为should,则扩展该snippet. \
 (注意, 也可以选择这一步直接扩展snippet, 即, sh =\>
直接调用所有should开头的snippet菜单)

-   如果键入的字符超过3个, 此时, 在光标所在行, 会弹出阴影,
    告诉你按下tab后会补全成什么单词.\
     此时的优先顺序是: 当前模式词典 =\> yasnippet =\>
    当前buffer的上下文)\
     要求此时按下tab, 应该总是扩展为阴影提示的字符. \
     例如: 你键入shou, 会看到后面有阴影提示ld, 此时立即按下tab键,
    应该总是自动完成should.\
     但此时又分为两种情况:

    -   如果此时按下tab键, 会立即从原先的shou, 补全为should.
    -   如果此时不按tab键, 0.8秒后, 光标所在行会自动弹出一个选择菜单.
        可以通过M-n, 和M-p在所有可能的自动完成中选择.

-   通过以上两种方式, 已经自动补全为should, 此时再次按下tab,
    会弹出一个yasnippet选择菜单\
     会有各种以should开头的snippet方案弹出, 根据name的不同,
    你可以选择一个, 然后扩展它.

(这里需要注意的是: 完全可以直接通过 键入sh =\> 按下tab
展开snippet菜单,此时必须同时满足以下条件:\
 - 键入should =\> 按下tab 展开snippet菜单.\
 - 键入sh =\> 按下tab, 展开snippet.\
 这在Emacs的snippet插件中, 很简单就可以做到.

唧唧歪歪一大堆, 最终的效果就是类似这样的:

    键入sh => 按下tab, 调用跟should有关的Rspec snippet菜单.
    键入shou => 按下tab, 展开为should, 也许你想自己输入自己的should定义, 此时就不用再次键入tab了.
    键入should => 按下tab, 调用跟should有关的Rspec snippet菜单, 跟sh一样.

方案也介绍完了, 有人会问, 至于费这么大劲儿么? 原先自带的不就挺好么?

我要说 我真的是很不喜欢老外的**单词首字母简写**的那种方案.\
 我承认这种的确简单, 也许会快一点点.

可是就拿Rspec当中常见的的should\_not来说\
 shnp, shnm, shnre, shnrt, shns, shnb, shkof, shbio, shnbc, shnbr, shne,
这还没完...,\
 这一大堆东西, 你第一次使用, 快捷键你记得住吗? 你知道是什么意思吗?

而且很明显, 这种方式及其容易冲突, 有时候你不得不做妥协,
例如两个snippet的首字母一样, 你可能必须\
 让其中一个稍稍改变一下. 这造成的后果是: 也许你熟练了, 觉得听自然,
但是让别人用起来, 会很晕. \
 怎么一会儿这样, 一会儿那样啊? 的确, 使用这种方式, 如果snippet太多,
重复性高, 你很难归纳出一个\
 有共性的东西,

我要的是: 以后不管新加多少snippet,
都可以采用此种方式来推断出你要采用的别名是什么的完整解决方案.

所以, 最后的结论是:

所有的snippet, 都采用完整的激活字符. 例如: Ruby中的classify方法,
我需要扩展代码块的使用方式,\
 对应的key就是classify, 只不过, 无论你是键入cla, 或者是键入class,
在按下tab, 都会自动补全为classify,\
 然后再次tab, 就自动补全snippet了.

针对就有高度相似的snippet, 使用同样的key, 例如,
跟render有关的所有snippet, 激活key都是render, \
 在弹出菜单里选择需要的snippet就是了.
