## Ruby on Rails China
[Ruby on Rails China](http://railschina.org) 是基于[octopress](http://octopress.org)一个开源的 Ruby on Rails 站点，任何人都可以在发布，管理，更新这个网站。
在这里你能够找到关于 _Ruby on Rails_ 的一切.
### 管理
由于[Ruby on Rails China](http://railschina.org) 是基于[octopress](http://octopress.org)的一个博客类站点，任何人都可以用 _Github_ fork 这份blog之后进行编辑，修改与更新发布文章，然后只要 push 到这里就可以。
关于文章中的一些特殊元素可能需要少许修改：

#### 代码片段

代码片段我使用了[SHJS](http://shjs.sourceforge.net/)开源着色库，你可以这样插入代码：
    {% sh [:ruby] %} This is a Ruby Code {% endsh %}
    {% sh [:javascript] %} This is a JS Code {% endsh %}

目前这个高亮着色功能可以支持：Ruby,Javascript,HTML,SQL,Spec,CSS,SHELL(sh) .

#### 目录 categories 和 Tags

文章可以设置categories和tags，前者可以选择 job(归为招聘求职类),development(归于开发类),activity(归于活动信息类),而后者可以使用数组形式加入多个你愿意加上的标签。

例如：

    ---
    layout: post
    title: "测试文章"
    date: 2012-07-24 23:29
    comments: true
    categories: development
    tags: ["this","is","just","a","post"]
    ---

### Ruby on Rails 中文生态圈
现在，有许多热心的人们在协助 Ruby on Rails 在中国的发展，你可以很轻易的找到他们。
如果对 Ruby on Rails 感兴趣

你首先应该加入[Ruby China](http://ruby-china.org).

你常常会需要查询[Rails Guides China](http://guides.railschina.org).

你应该订阅一份中文版的 Rails 播客,[Rails Caster China](http://railscasts-china.com/)

还有一份经常更新的 [Ruby on Rails China](http://railschina.org).
