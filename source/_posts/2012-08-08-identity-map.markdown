---
layout: post
title: 'Identity Map in Rails3.1'
date: 2012-08-08 01:20
comments: true
categories: development
tags: ['rails']
author: Hooopo
---
转自 [iteye Hooopo的博客](http://hooopo.iteye.com/blog/1081767).

Identity Map是Rails3.1的又一个新特性。 

# 什么是Identity Map 

> Identity Map is a design pattern that: 
>  Ensures that each object gets loaded only once by keeping every loaded object in a map. Looks up objects using the map when referring to them. 
>  <http://www.martinfowler.com/eaaCatalog/identityMap.html>

下面的代码是ActiveRecord在未开启Identify Map时的表现： 

{% sh [:ruby] %}
user = User.first  
  User Load (0.3ms)  SELECT "users".* FROM "users" LIMIT 1  
same_user = User.find 1  
  User Load (11.3ms)  SELECT "users".* FROM "users" WHERE "users"."id" = ? LIMIT 1  [["id", 1]]  
user == same_user  
=> true  
user.object_id == same_user.object_id  
=> false 
{% endsh %}

上面的user和same_user是都是id为1的User对象，但是却是两个对象。 

下面开启Identity Map：


{% sh [:ruby] %}
ActiveRecord::IdentityMap.enabled = true  
user = User.first  
User Load (0.4ms)  SELECT "users".* FROM "users" LIMIT 1  
same_user = User.find 1  
User Loaded  From Identity Map (id: 1)  
user == same_user  
=> true  
user.object_id == same_user.object_id  
=> true
{% endsh %}

当ActiveRecord开启了Identity Map后，每一个model会维持一个Map，每次实例化对象之前会通过主键去这个model对应的Map里找到对应的对象。如果存在，直接从Map里返回这个对象，否则才进行查询，实例化对象后放到Map里。 
# 和Query Cache/Cache Money的差别 
听起来和ActiveRecord的query cache或是cache money类似。实际上差别蛮大的： 

从减少db查询方面和query cache一样，缓存池是在一次请求结束后销毁。各个请求之间不共享，而cache money是全局的，缓存结果可以被持续利用。 
query cache是根据sql来做主键，而identity map和cache money是根据model的主键。 

Identity Map还具有减少内存使用和保持一致性的作用。 

# Identity Map的优点 

1.一致性：一个model对象保持完全唯一的引用，避免了更新同一个对象时候产生的不一致现象。 

下面的例子是未开启Identity Map时，同一条记录的num被两次增加1，但是结果只增加了1.造成最终结果和实际不一致。而开启了Identity Map的结果最终是正确的。 

{% sh [:ruby] %}
 user = User.first  
  User Load (0.3ms)  SELECT "users".* FROM "users" LIMIT 1  
 same_user = User.find 1  
  User Load (12.2ms)  SELECT "users".* FROM "users" WHERE "users"."id" = ? LIMIT 1  [["id", 1]]  
 user.num = user.num + 1  
=> 1  
 user.save  
   (0.9ms)  UPDATE "users" SET "updated_at" = '2011-06-12 09:46:32.722893', "num" = 1 WHERE "users"."id" = 1  
=> true  
 same_user.num = same_user.num + 1  
=> 1  
 same_user.save  
   (0.4ms)  UPDATE "users" SET "updated_at" = '2011-06-12 09:46:53.093752', "num" = 1 WHERE "users"."id" = 1  
=> true  
 user.reload  
=> #<User id: 1, name: nil, num: 1, created_at: "2011-06-12 03:00:30", updated_at: "2011-06-12 09:46:53">#这里结果不一致了  
 ActiveRecord::IdentityMap.enabled = true  
=> true  
 same_user = User.find 1  
  User Load (0.2ms)  SELECT "users".* FROM "users" WHERE "users"."id" = ? LIMIT 1  [["id", 1]]  
=> #<User id: 1, name: nil, num: 1, created_at: "2011-06-12 03:00:30", updated_at: "2011-06-12 09:46:53">  
 user = User.first  
  User Load (0.3ms)  SELECT "users".* FROM "users" LIMIT 1  
  User Loaded  From Identity Map (id: 1)  
=> #<User id: 1, name: nil, num: 1, created_at: "2011-06-12 03:00:30", updated_at: "2011-06-12 09:46:53">  
 same_user.num = same_user.num + 1  
=> 2  
 same_user.save  
   (0.4ms)  UPDATE "users" SET "updated_at" = '2011-06-12 09:51:59.203676', "num" = 2 WHERE "users"."id" = 1  
 user.num = user.num + 1  
=> 3  
 user.save  
   (0.5ms)  UPDATE "users" SET "updated_at" = '2011-06-12 09:52:21.643577', "num" = 3 WHERE "users"."id" = 1 #加了两次1结果为3，正确！ 
{% endsh %}

2.节省内存：不会重复创建相同的对象。 

3.提高速度：和ActiveRecord的query cache一样，减少db hits 

# 存在的问题 

目前默认还是未开启的。因为最近发现的在处理关联时的问题：

{% sh [:ruby] %}
# Active Record Identity Map does not track associations yet. For example:  
#   comment = @post.comments.first  
#   comment.post = nil  
#   @post.comments.include?(comment) #=> true  
#  
# Ideally, the example above would return false, removing the comment object from the  
# post association when the association is nullified. This may cause side effects, as  
# in the situation below, if Identity Map is enabled:  
#  
#   Post.has_many :comments, :dependent => :destroy  
#  
#   comment = @post.comments.first  
#   comment.post = nil  
#   comment.save  
#   Post.destroy(@post.id)  
#  
# Without using Identity Map, the code above will destroy the @post object leaving  
# the comment object intact. However, once we enable Identity Map, the post loaded  
# by Post.destroy is exactly the same object as the object @post. As the object @post  
# still has the comment object in @post.comments, once Identity Map is enabled, the  
# comment object will be accidently removed.  
#  
# This inconsistency is meant to be fixed in future Rails releases.{% endsh %}


