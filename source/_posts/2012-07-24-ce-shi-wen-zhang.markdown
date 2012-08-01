---
layout: post
title: "测试文章"
date: 2012-07-24 23:29
comments: true
categories: work
tags: ['test','firstpost']
---
### 测试文章
#### 标题测试
# 一号标题
## 二号标题
### 三号标题
#### 四号标题
##### 五号标题
###### 六号标题
#### 链接
This is [an example](http://example.com/ "Title") inline link.
See my [About](/about/) page for details.  
这是[Google][]
[Google]: http://google.com/
I get 10 times more traffic from [Google] [1] than from
[Yahoo] [2] or [MSN] [3].

  [1]: http://google.com/        "Google"
  [2]: http://search.yahoo.com/  "Yahoo Search"
  [3]: http://search.msn.com/    "MSN Search"
#### 图片
![Ruby小图](http://www.ringswithlove.com/wp-content/uploads/2010/11/july-birthstone-ruby.jpg)
![Rails大图](http://images.51cto.com/files/uploadimg/20110805/0903160.jpg)
#### 代码
首先是直接用 markdown 自带的代码如下
``There is a literal backtick (`) here.``
代码片段
    This is a code block.
或者
    <div class="footer">
        &copy; 2004 Foo Corporation
    </div>
采用SHJS代码
{% sh [:ruby] %}
module Jekyll

class SHJS < Liquid::Block

  def initialize(tag_name, markup, tokens)
    @lang = "js"
    if markup =~ /\s*:(\w+)/i
      @lang = $1
    end
    @lang = format_lang @lang
    super
  end 
  end
{% endsh %}
#### 引用
正常引用
> This is a blockquote
> inside a list item.
使用blockquote关键字
<blockquote>
 <p>Wheeee!</p>
 <footer>
 <strong>Bobby Willis</strong><cite><a href="http://google.com/search?q=pants">The Search For Bobby's Pants</a>
</blockquote>
#### 列表效果
* 无序列表1  
* 无序列表2  
* 无序列表3  


1. 有序列表1
2. 有序列表2
3. 有序列表3
<!--more--> 
#### 强调
*single asterisks*

_single underscores_

**double asterisks**

__double underscores__
