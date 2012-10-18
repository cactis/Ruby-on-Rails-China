---
layout: post
title: "谈谈今天 ruby-china 的优化"
date: 2012-10-17 22:02
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/1040)
今天我做了几件事情：

    1. 给 Topic model 加上了 last_reply_user_login 和 node_name 字段，在数据创建的时候写入，以减少列表也的动态查询；
    2. 修正了分页的 Bug 带来的性能问题；
    3. 给 User, Node, Section 加上了 MongoDB 的 cache；
    4. MongoDB 移到了 MongoIC 上面去；
    5. 服务上面的 Ruby 重新装了一下那个  falcon 补丁，并试着调整了一下 GC 参数(看起来比之前好些了);

随着数据越来越多，我渐渐赶紧 ruby-china
越来越慢了，日志显示有时候论坛首页打开要`600ms`...无法接受，而论坛的分页页面就更离谱了，`1300ms`+
...\
 于是我试着检查慢下来的原因\
 开始是想将 最后回复人和节点两个数据写死到 `Topic` 里面

    class Topic
      belongs_to :user
      belongs_to :last_reply_user
      field :last_reply_user_login
      belongs_to :node
      field :node_name
    end

目前列表页面需要关联三个数据 `user`, `last_reply_user` 和 `node`，而
`node` 的数据有不是市场修改的，而列表展示只是需要 `name`
字段，所以如果直接再 `Topic` 保存的时候存下
`node_name`，那查询的时候就会省下很多了，`last_reply_user` 也是同理。\
 这个改动后，论坛首页就只有两个动态查询了。

不过这个改动导致我不得不把修改帐号名的功能给关闭的。

论坛首页的速度是上去了，但是分页依然还是很慢。\
 无意中我发现查询日志里面 includes user 的 id 数量非常多，有 Topic
的总数那么多...

**后面才知道原来 `will_paginate` 无法支持 Mongoid
的分页方式，目前实现的分页原来是假象，它是先取出全部的数据后，用 Array
来分页...**

解决办法就是另外再安装 `will_paginate_mongoid` 这个 Gem，具体再
will\_paginate\_mongoid 的 Github 页面上也有说明
[https://github.com/lucasas/will\_paginate\_mongoid](https://github.com/lucasas/will_paginate_mongoid)

然后，速度自然上去了，这个 Bug 数据少的时候无法发现...
