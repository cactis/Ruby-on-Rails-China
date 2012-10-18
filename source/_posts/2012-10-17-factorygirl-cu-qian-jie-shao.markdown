---
layout: post
title: "FactoryGirl 粗浅介绍"
date: 2012-10-17 22:55
comments: true
categories: Ruby-China
author: Juanito
---
转载自[Ruby-China](http://ruby-china.org/topics/3777)
写的有点赶, 大家凑合著看, 有问题去 factory\_girl 的 github wiki 页面
了解更多...或是发问...

#### 为神马不用假数据 (Why not fixtures?)

神马是假数据？

> Fixtures are a way of organizing test data

一种组织管理你测试数据的方法。

#### 假数据

-   用 YAML 写成，不是 Ruby

首先 Rails 的 Fixture 是用 YAML 写成的，比 XML
简洁多拉，但还是不爽阿，咱项目都用 Ruby 写的，我全都要用 Ruby!!!
就有人就开始在 YAML 里面塞 Ruby 代码，使用了 YAML 的继承特性...很快你的
YAML 就一团混乱拉。

-   YAML 直接插入数据库，太粗暴了

直接硬上也不做个安全措施……这点在很多方面都不好的，你懂得，比如没有验证 (NO
validations)...

-   忽视 ActiveRecord ，没有 callback

ActiveRecord 有一套自己的流程，直接把 YAML 插入数据库，

整个不把 ActiveRecord 放在眼里，当然也不能使用好用的回调函数
(callback)拉...

如果想自己加入 callback，那又得在假数据里面塞 Ruby
代码。。。又变一团糟了。

好了，米国有一家 Thoughtbot 公司，里面一群帅哥

![hot-geeks-thoughtbot](https://github.com/JuanitoFatas/Foto/raw/master/M/thoughtbot-factory-girls.png)

觉得 尼马，这太坑爹了
，就搞了一个[工厂女孩](https://github.com/thoughtbot/factory_girl)(...)来解决假数据的问题...

#### 为 Rails 安装工厂女孩 (Installing FactoryGirl for Rails)

> factory\_girl\_rails provides Rails integration for factory\_girl.
> Automatic factory definition loading will be added.

首先打开你的 `Gemfile` 添加：

    group :test, :development do
        gem 'factory_girl_rails'
    end

`bundle` 一下就装好了，喔耶！

它主要的核心功能是从 `factory_girl` 这个 Gem 来的。

> 目前 2012 年 6 月 12 日最新版本是 3.4.0

#### 创建工厂

好了，安装好了，让我们看看怎么创建工厂哈...

先建立个 model 当例子

        rails g model guitar description:string year:string strings:integer lefty:boolean

一个吉他模型，有著吉他的描述、年份、是几弦(strings)的 左手吉他(lefty)...

      invoke  active_record
      create    db/migrate/20120613012531_create_guitars.rb
      create    app/models/guitar.rb
      invoke    test_unit
      create      test/unit/guitar_test.rb
      invoke      factory_girl
      create        test/factories/guitars.rb

刚刚我们在 Gemfile 把 `factory_girl_rails` 加在 `:development` 分组，

这样之后只要用到 `rails g model` 命令，就会自动替我们创建工厂：

        create        test/factories/guitars.rb

喔耶！接下来让我们迁移一下数据库：

    rake db:migrate db:test:prepare

喔耶！迁移成功：

        ==  CreateGuitars: migrating ==================================================
        -- create_table(:guitars)
           -> 0.0024s
        ==  CreateGuitars: migrated (0.0025s) =========================================

接下来打开 `test/factories/guitars.rb` ：

        # Read about factories at https://github.com/thoughtbot/factory_girl

        FactoryGirl.define do
          factory :guitar do
            description "MyString"
            year "MyString"
            strings 1
            lefty false
          end
        end

`factory_girl` gem 帮我们照刚刚产生模型那行指令建立了一个工厂...

我们生产吉他的工厂建好了...

现在让我们建立一下吉他的 model...

        rails g model guitar description:string year:string strings:integer lefty:boolean

接下来让我们打开 console 在测试数据库里面玩弄一下工厂女孩 这个 gem...

        rails c test

弄一支新吉他来玩玩

        guitar = FactoryGirl.create(:guitar)

会看到：

        (0.2ms)  begin transaction
        SQL (1.2ms)  INSERT INTO "guitars" ("created_at", "description", "lefty", "strings", "updated_at", "year") VALUES (?, ?, ?, ?, ?, ?)  [["created_at", Wed, 13 Jun 2012 01:34:05 UTC +00:00], ["description", "MyString"], ["lefty", false], ["strings", 1], ["updated_at", Wed, 13 Jun 2012 01:34:05 UTC +00:00], ["year", "MyString"]]

        (1.4ms)  commit transaction
        => #<Guitar id: 2, description: "MyString", year: "MyString", strings: 1, lefty: false, created_at: "2012-06-13 01:34:05", updated_at: "2012-06-13 01:34:05">

我们创了一把吉他出来，注意 SQL 是用 `INSERT INTO` ...

如果我们只是想创建一个吉他，但暂时不要建立一个记录，那可以:

        guitar = FactoryGirl.build(:guitar)

我们就可以把玩各式各样 guitar 所有的方法啦...

        guitar.new_record?
        => true

如果要存入数据库也是很简单:

        guitar.save

TIPS: `attributes_for` 方法会针对给定的工厂返回一个
hash，这在功能及控制器测试里很有用。

        attrs = FactoryGirl.attributes_for(:guitar)
        => {:description=>"MyString", :year=>"MyString", :strings=>1, :lefty=>false}

#### 继承 (Inheritance)

让我们看看怎么用继承来让代码 DRY

假如我们有两种吉他，一个叫做 coldplay\_lefty 左手吉他, coldplay\_lefty
是六弦的，

年份 2000，另一个叫做 placebo，年份
2010，我们要怎么样利用继承来尽量不重复代码呢：

        # Read about factories at https://github.com/thoughtbot/factory_girl

        FactoryGirl.define do
          factory :guitar do
            description "Basic Guitar"
            year "2012"
            strings 7
            lefty false

            factory :coldplay_lefty do
                description 'coldplay'
                year '2000'
                strings 6
                lefty true
            end

            factory :placebo do
                description 'placebo'
                year '2010'
            end
          end
        end

接下来重启 console 来试试看：

        rails c test
        placebo = FactoryGirl.create(:placebo)
        coldplay_lefty = FactoryGirl.create(:coldplay_lefty)

#### 关系 Relationships

好了，现在我们有俩店面，有的吉他是从 A 店面卖的，有的从 B 店面卖的，咋整呢？

产生一个店面 model 来存放吉他...一样 `factory_girl`
会替我们建立好工厂...

        $ rails g model store_location address:string
          invoke  active_record
          create    db/migrate/20120613020928_create_store_locations.rb
          create    app/models/store_location.rb
          invoke    test_unit
          create      test/unit/store_location_test.rb
          invoke      factory_girl
          create        test/factories/store_locations.rb

接著将两个表关连起来，给 Guitar 表加个 Foreign key...

        rails g migration AddStoreLocationIdToGuitars store_location_id:integer

准备好数据库

        rake db:migrate db:test:prepare

去 `app/models/guitar.rb` 添加两者的关系:

        belongs_to store_location

去 `test/factories/guitars.rb` 添加 `store_location`

        # Read about factories at https://github.com/thoughtbot/factory_girl

        FactoryGirl.define do
          factory :guitar do
            description "Basic Guitar"
            year "2012"
            strings 7
            lefty false
            store_location

            factory :coldplay_lefty do
                description 'coldplay'
                year '2000'
                strings 6
                lefty true
            end

            factory :placebo do
                description 'placebo'
                year '2010'
            end
          end
        end

重启 console 试试:

    rails c test
    FactoryGirl.create(:guitar)

成功的话会发现两个表已经关联起来了，看看有没有 `store_location_id`
这个...

添加特定吉他销售地 `test/factories/store_locations.rb` :

        # Read about factories at https://github.com/thoughtbot/factory_girl

        FactoryGirl.define do
          factory :store_location do
            address "My String"
          end

          factory :coldplay_showroom, class: 'StoreLocation' do
            address "UK London coldplay"
          end

          factory :placebo_showroom, class: 'StoreLocation' do
            address "UK Oxford placebo"
          end
        end

注意要加上 `class: 'StoreLocation'` 告诉它这是给 StoreLocation
用的工厂...

去 `test/factories/guitars.rb` 添加特定 `store_location`

        # Read about factories at https://github.com/thoughtbot/factory_girl

        FactoryGirl.define do
          factory :guitar do
            description "Basic Guitar"
            year "2012"
            strings 7
            lefty false
            store_location

            factory :coldplay_lefty do
                description 'coldplay'
                year '2000'
                strings 6
                lefty true
                store_location factory: :coldplay_showroom
            end

            factory :placebo do
                description 'placebo'
                year '2010'
                store_location factory: :placebo_showroom
            end
          end
        end

#### 序列 (Sequences)

> If you need uniqueness on a field, sequencing comes in handy. The
> sequences can then be used in your other definitions. E.g. email

好，现在帮所有生产的吉他标个号。。。

        rails g migration AddInventoryCodeToGuitars inventory_code:string

        invoke  active_record
          create    db/migrate/20120613023044_add_inventory_code_to_guitars.rb

准备数据库...

        rake db:migrate db:test:prepare
                ==  AddInventoryCodeToGuitars: migrating ======================================
                -- add_column(:guitars, :inventory_code, :string)
            -> 0.0013s
                ==  AddInventoryCodeToGuitars: migrated (0.0015s) =============================

到 `test/factories/guitars.rb` 添加一个 `sequence`

        sequence :inventory_code do |n|
            "GR#{n}"
        end

这样用：

        inventory_code { FactoryGirl.next(:inventroy_code)}

整个文件看起来：

    # Read about factories at https://github.com/thoughtbot/factory_girl

    FactoryGirl.define do

        sequence :inventory_code do |n|
            "GR#{n}"
        end

      factory :guitar do
        description "Basic Guitar"
        year "2012"
        strings 7
        lefty false
        store_location
        inventory_code { FactoryGirl.generate(:inventory_code)}

        factory :coldplay_lefty do
            description 'coldplay'
            year '2000'
            strings 6
            lefty true
            store_location factory: :coldplay_showroom
        end

        factory :placebo do
            description 'placebo'
            year '2010'
            store_location factory: :placebo_showroom
        end
      end
    end

也可以一行搞定:

        sequence(:inventory_code) { |n| "GR#{n}" }

...希望你大概了解了怎么用工厂女孩，更多信息上 github wiki 看...

[factory\_girl WIKI](https://github.com/thoughtbot/factory_girl/wiki)
