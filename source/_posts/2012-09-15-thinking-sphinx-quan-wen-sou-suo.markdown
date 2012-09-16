---
layout: post
title: "Thinking Sphinx 全文搜索"
date: 2012-09-15 14:28
comments: true
categories: development
tags: ['searching','thinking sphinx','full text']
author: Tassandar
---

目前，在 Ruby on Rails 世界中分词搜索做的最好的就要算[Sunspot][SS]和[Thinking Sphinx][TS]了，前者实现的引擎是[solr](lucene.apache.org/solr),后者的引擎是[Sphinx][SP].


就两者比较来看，[Sunspot][SS]是一个全能的多面手，自定义性能强，数据库支持种类多，而且协议是基于 Apache License 可随意使用，缺点就是比较重，可能调试起来要复杂一些。


而[Sphinx][SP]只支持 MySQL 和 PostgreSQL,优点是速度比较快（个人的感觉），实现起来比较简单，如果是比较小的网站还是很合适的。


[Thinking Sphinx][TS] 是 Rails 中 [Sphinx][SP] 的实现。它实现了 Sphix 和 Active Record 之间的配合。

### 1. 安装

要用上 [Thinking Sphix] 你首先要装上 [Sphinx].

如果是 MacOS 那么我想没有什么能比使用 Homebrew 更简单直接的方法了：

`brew install sphinx`

如果是其他类 Unix 系统 ，那么就只好下载源码编译了。

也很容易，从[Download Sphinx](http://sphinxsearch.com/downloads.html)下载来源码之后安装编译就行：

    .configure
    make
    sudo make install 

另外编译的时候需要指定好数据库的存放位置。

* PostgreSQL: `.configure --with-pgsql=/usr/local/include/postgresql`

* MySQL: `.configure --with-pgsql=/usr/local/mysql/lib`

数据库的 Libraray 位置可能不太一样，如果出现没找到数据库文件的错误就找到正确的位置重新编译或者用 `ln -s `命令链接一下就好。


<!--more--> 

至于 Windows ,同样[Download Sphinx](http://sphinxsearch.com/downloads.html) 有Windows 的安装包。因为自己也没实践过，所以 Good Luck。

其次，要把 [Thinking Sphinx][TS] 加入到 Rails 中，你首先要做的就是把 [Thinking Sphinx][TS] 加入到你的 `Gemfile` 中去。

{% sh [:ruby] %}
gem 'thinking-sphinx'
{% endsh %}

之后就 `bundle install` 就ok。

### 2. Index

之后就要为自己的项目加入需要索引的栏目。
* 索引应写在 Model 里面

例如这样：

{% sh [:ruby] %}
class Api < ActiveRecord::Base
 attr_accessible :name, :content
  define_index do
    indexes :name
    indexes content
  end
end
{% endsh %}

在 `define_index` 的 block 中

indexes 函数指定该 Model 数据库栏目作为索引对象。如果需要索引的栏目是 Ruby 语言中的内建函数（例如 id，name，type）那你就需要使用Symbol的方式来表示。


* 还可以用 `:as` 来建立一个别名。

例如： indexes content ,:as => :post


* 可以用 `:sortable` 表示该索引建立在排序后进行

`indexes :name ,:sortable => true `


* 可以开启 facet 功能（一种搜索结果分类,类似 SQL 的 group ）

`indexes :name,:facet => true`


* 如果你需要对该模型的关系对象进行索引

`indexes author.location, :as => author_location`


* 同样，如果是特殊的内建函数的字眼，就需要用 Symbol

`indexes author(:id),:as => author_id`


* 甚至可以把多个栏目合并

`indexes [first_name,last_name], :as = > :name`


* 用SQL语句处理后的项目用来做索引

`indexes "LOWER(first_name), :as => :first_name"`



### 3.Attributes

刚刚说的是索引，你可以为你的每个索引都加入一个 Attribute ，用来做结果筛选或者其他需求。


和索引一样,只要在 define_index 的 block 中加入 `has` 属性就可以了


`has attribute`


最后的合起来一个 [Thinking Sphinx][TS] 索引函数可能看起来是这样的：


{% sh [:ruby]%}
define_index do
    indexes subject, :sortable => true
    indexes content
    indexes author(:name), :as => :author, :sortable => true

    has author_id, created_at, updated_at
end
{% endsh%}


### 4.建立索引


之后，使用 [Thinking Sphinx][TS] 的 rake  脚本


`rake ts:index`


如果是重建索引 ，就使用 
 
`rake ts:rebuild`

然后，启动 [Thinking Sphinx][TS] 的后台服务

`rake ts:start`

这样，你就可以 Sphinx 进行搜索了。

### 5.搜索

建立了索引之后，搜索就变得手到擒来。

直接对model调用 search 函数就可以了

`Article.search "cool"`

搜索有一些选项：

* Field Condition

和 AR 的搜索一样，[Thinking Sphinx][TS] 也在搜索中加入了条件选项：


`Article.search 'pancakes', :conditions => {:subject => 'tasty'}`


* Attribute Condition


记得刚刚说的 Attribute  么，他们用上了。


他们同样可以用在条件搜索中，但是它比 Field ，更强大，能够接收一个数组或者 Range 做参数判断

    Article.search 'pancakes', :with => {
      :created_at => 1.week.ago..Time.now,
      :author_id  => @fab_four.collect { |author| author.id }
    }

用它还能够做到排除选项：

Article.search 'pancakes',
  :without => {:user_id => current_user.id}

* 全模型搜索

当你在多个模型中做了索引之后，你可能会有要在所有模型中搜索的需求,这样就好：

`ThinkingSphinx.search 'pancakes'`

* 分页

细心的人已经发现了。使用搜索命令 [Thinking Sphinx][TS] 最多只会返回 20 个值，那是因为作者默认加入了分页功能。

分页功能基本和 will_paginage 一模一样，直接就可以用。

`Article.search 'pancakes', :page => params[:page], :per_page => 42`

这样它就和 [will_paginage gem](https://github.com/mislav/will_paginate) 合作的天衣无缝。
在使用了 Will Paginate  之后，直接在 View 中加入

`<%= will_paginage %>`

就搞定了。

* 匹配模式和等级模式

Thinking Sphinx 的后台是 Sphinx ，Sphinx 具有多种单词匹配方式和等级(Rank)模式，[Thinking Sphinx][TS]为它留好了api接口。


匹配模式：

`Article.search 'pancakes waffles', :match_mode => :any`


Rank Modes

`Article.search "pancakes", :rank_mode => :bm25`

具体选项可以参照

* [Sphinx Match Modes Document](http://www.sphinxsearch.com/docs/current.html#matching-modes)

* [Thinking Sphinx Match Modes](http://pat.github.com/ts/en/searching.html#matchmodes)

* [Sphinx Rank Modes Document](http://www.sphinxsearch.com/docs/current.html#api-func-setrankingmode)

* [Thinking Sphinx Match Modes](http://pat.github.com/ts/en/searching.html#matchmodes#ranking)


* 排序与权重

只有 Attribute 才能在排序中使用（因为 field 有 sortable 属性了）。

`Article.search "pancakes", :order => :created_at,  :sort_mode => :desc`

在 ` :order ` 选项中，有几个Sphinx赠送的属性

* @id         根据 Sphinx 索引的 ID 排序
* @weight,@rank/@relevance    根据 Sphinx  的 Rank 或者 Weight 产生,需要 使用 sort_mode => extend 模式
* @random     随机产生


例如这样：

    Article.search "pancakes", :sort_mode => :extended,
      :order => "created_at DESC, @relevance DESC"

关于权重，你可以这样为你的 Field 加入权重指标

    Article.search "pancakes", :field_weights => {
      :subject => 10,
      :tags    => 6,
      :content => 3
    }

还有很多 Sphinx 的选项作为备选，甚至你可以自己写出一套很复杂的排序算法，不过这后面的水很深。

如果你确定要开启这样的 HARD 模式。就从 Sphinx 的 [文档](http://www.sphinxsearch.com/docs/current.html#sorting-modes) 开始吧。


*  分类

和排序一样 [Sphinx][SP] 中为分类做了比较复杂的考虑。

具体可以参照 [Sphinx Document](http://sphinxsearch.com/docs/current.html#clustering)


和 [Thinking Sphinx 的说明](http://pat.github.com/ts/en/searching.html#grouping)


* 其他

由于 [Thinking Sphinx][TS] 的文档非常全。还有一些比较零碎的选项和功能大家都可以在那里找到。

### 6.Delta

很快就会有一个很大的问题出现，那就是当索引的内容改变了怎么办。

解决方法就是加入 Delta 属性。

每当索引项目被改变之后， Ｓｐｈｉｎｘ　就对改变的索引项目重新进行索引。

![Delta 功能示意](http://www.railschina.org/images/ts-delta.png)

1. 为你的模型加入 Delta 属性。
{% sh [:ruby]%}
def self.up
  add_column :articles, :delta, :boolean, :default => true,
    :null => false
end
{%endsh%}

run ` rake db:migrate `

2. 为你的索引加入 Delta

{% sh [:ruby]%}
define_index do
  # ...

  set_property :delta => true
end
{%endsh%}

3. 重建索引

`rake ts:rebuild`

搞定。这样，Sphinx 的索引就会随着你的模型数据的更新而更新了。

如果你需要在索引重建的时候用上 异步系统 例如加上 Delay Job 或者 Resque ，你可以看看官方文档上的[例子](http://pat.github.com/ts/en/deltas.html)

### 7.配置

[Thinking Sphinx][TS] 还设计了配置文件，如果需要，你可以加入到 `config/sphinx.yml` 文件中去（没有就新建）。

写法大约是这样：

development:
    port: 3312
    mem_limit: 64M
  test:
    port: 3313
    mem_limit: 64M
  production:
    port: 3312
    mem_limit: 128M

至于配置的具体参数配置，你依然可以在官方网站上找到。

这里截了一份配置参数表：

![configuration-1](http://www.railschina.org/images/configuration-1.png)



![configuration-2](http://www.railschina.org/images/configuration-2.png)



![configuration-3](http://www.railschina.org/images/configuration-3.png)




![configuration-4](http://www.railschina.org/images/configuration-4.png)



![configuration-5](http://www.railschina.org/images/configuration-5.png)


### 8.参考资料

* [Thinking Sphinx][TS]
* [Thinking Sphinx in Github](https://github.com/pat/thinking-sphinx)
* [Sphinx][SP]
* [Thinking Sphinx pdf by Peepcode](https://peepcode.com/products/thinking-sphinx-pdf)
* [peedcode 的 Thinking Sphinx 实作](https://github.com/topfunky/peepcode-sphinx-address-book)
* [120.Thinking Sphinx Railscast](http://railscasts.com/episodes/120-thinking-sphinx)



[TS]: http://pat.github.com/ts/en
[SP]: http://sphinxsearch.com
[SS]: http://sunspot.github.com
