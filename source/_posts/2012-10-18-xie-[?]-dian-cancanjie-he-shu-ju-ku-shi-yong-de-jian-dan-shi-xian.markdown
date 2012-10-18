---
layout: post
title: "写一点CanCan结合数据库使用的简单实现"
date: 2012-10-18 11:50
comments: true
categories: RubyChina
author: beiersi
---
转载自[Ruby-China](http://ruby-china.org/topics/5938)
一个中小型旅行社使用的一个简易CRM系统。需要管理员能通过页面来对用户授权，颗粒精细到action即可。相关的Gems如下：

-   rails 3.2.8
-   devise 2.1.2
-   simple\_form 2.0.2
-   cancan 1.6.8

思路：\

使用CanCan实现基于数据库的授权。可以参考Cancan的wiki上这篇文章[[https://github.com/ryanb/cancan/wiki/Abilities-in-Database](https://github.com/ryanb/cancan/wiki/Abilities-in-Database)]。\
 用表 **permissions** 保存所有的权限，与 **users** 的关系是
**has\_and\_belongs\_to\_many**，在 **Ability.rb** 中处理一下
**user.permissions** 既可。

下面是具体实现的几个基本步骤：\
 Gemfile和devise的配置过程省略。\
 1.创建model Permission\
`rails g model Permission action subject description`

2.创建has\_had\_belongs\_to\_mang中间表。\
`rails g migration UsersHABTMPermissions`

3.编辑 db/migrate/xx\_users\_habtm\_permissions.rb

    class UsersHabtmPermissions < ActiveRecord::Migration
      def up
        create_table :permissions_users, :id => false do |t|
          t.references :permission
          t.references :user
        end
        add_index :permissions_users, [:user_id, :permission_id]
        add_index :permissions_users, [:permission_id, :user_id]
      end

      def down
        drop_table :permissions_users
      end
    end

4.执行rake db:migrate生成表\
`rake db:migrate`

5.编辑app/models/permission.rb，和app/modles/user.rb，加入habtm关系

    # app/models/user.rb
    class User < ActiveRecord::Base
      .
      .
      .

      has_and_belongs_to_many :permissions
    end

    # app/models/permission.rb
    class Permission < ActiveRecord::Base
      attr_accessible :action, :description, :subject
      has_and_belongs_to_many :users
    end

5.创建app/models/ability.rb

    class Ability
      include CanCan::Ability

      def initialize(user)
        user ||= User.new

        ## 指定超级用户
        if user.id == 1
          can :manage, :all
        else
          user.permissions.each do |p|
            begin
              action = p.action.to_sym
              subject = begin
                          # RESTful Controllers
                          p.subject.camelize.constantize
                        rescue
                          # Non RESTful Controllers
                          p.subject.underscore.to_sym
                        end
              can action, subject
            rescue => e
              Rails.logger.info "#{e}"
              Rails.logger.info "#{subject}"
            end
          end
        end
      end
    end

这样基本的步骤就完成了。然后我们手动把权限一条一条的加上去，并对用户授权\
 举例：

    ## 增加权限
    Permission.create(:action => 'manage', :subject => 'user', :description => '用户管理')
    Permission.create(:action => 'manage', :subject => 'hotel', :description => '酒店管理')
    Permission.create(:action => 'read', :subject => 'hotel', :description => '酒店查看')
    Permission.create(:action => 'index', :subject => 'hotel', :description => '酒店列表查看')
    ## 给用户授权
    user = User.find 10
    user.permissions = [...]

最后不要忘记在相应的controller中加入：

    ## 第一种情况 RESTful Controllers
    load_and_authorize_resource
    # 或者
    authorize_resource

    ## 第二种情况 Non RESTful Controllers 
    authorize_resource :class => false

以上是本人在使用Cancan结合数据使用的简单实现，限于篇幅，用户授权和权限列表的页面操作就省略了，都是比较基础的CRUD操作。
