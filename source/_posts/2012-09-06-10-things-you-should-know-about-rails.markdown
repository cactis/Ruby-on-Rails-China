---
layout: post
title: "你可能错过的 Rails 技巧"
date: 2012-09-06 11:15
comments: true
categories: development
author: dayuan
tags: ['skill','RailsConf']
---

转载自 <http://dayuan.im>


记得前段时间 RailsConf2012 之后看过一个不错的pdf,[10 things you didn’t know rails could do](https://speakerdeck.com/u/jeg2/p/10-things-you-didnt-know-rails-could-do)

说是10个，但是给出了42个实例，这几天抽空又回味了下，料很多，写的很好，顺便总结学习下

### 1.  最小的rails app

{% sh [:ruby] %}
%w(action_controller/railtie coderay markaby).map &method(:require)

run TheSmallestRailsApp ||= Class.new(Rails::Application) {
  config.secret_token = routes.append {
    root to: proc {
      [200, {"Content-Type" => "text/html"}, [Markaby::Builder.new.html {
        title @title = "The Smallest Rails App"
        h3 "I am #@title!"
        p "Here is my source code:"
        div { CodeRay.scan_file(__FILE__).div(line_numbers: :table) }
        p { a "Make me smaller", href: "//goo.gl/YdRpy" }
      }]]
    }
  }.to_s
  initialize!
}

{% endsh %}
### 2.  提醒功能 TODO
{% sh [:ruby] %}

class UsersController < ApplicationController
  # TODO:  Make it possible to create new users.
end

class User < ActiveRecord::Base
  # FIXME: Should token really  be accessible?
  attr_accessible :bil, :email, :name, :token
end

<%# OPTIMIZE: Paginate this listing. %>
<%= render Article.all %>

{% endsh %}

执行 rake notes

{% sh [:ruby] %}
app/controllers/users_controller.rb:
  * [ 2] [TODO] Make it possible to create new users.

app/models/user.rb:
  * [ 2] [FIXME] Should token really be accessible?

app/views/articles/index.html.erb:
  * [ 1] [OPTIMIZE] Paginate this listing.
{% endsh %}

查看单独的 TODO / FIXME / OPTIMIZE


<!--more--> 
{% sh [:ruby] %}

rake notes:todo

app/controllers/users_controller.rb:
  * [ 2] Make it possible to create new users.
{% endsh %}

可以自定义提醒名称

{% sh [:ruby] %}

class Article < ActiveRecord::Base
  belongs_to :user
  attr_accessible :body, :subject
  # JEG2: Add that code from your blog here.
end
{% endsh %}

不过需要敲一长串，可以alias个快捷键

{% sh [:ruby] %}

rake notes:custom ANNOTATION=JEG2

app/models/article.rb:
  * [ 4]Add that code from your blog here.
{% endsh %}

### 3. 沙箱模式执行 rails c

{% sh [:ruby] %}
rails c --sandbox
{% endsh %}

沙箱模式会有回滚事务机制，对数据库的操作在退出之前都会自动回滚到之前未修改的数据

### 4. 在 rails c 控制台中使用 rails helper 方法

{% sh [:ruby] %}
$ rails c
Loading development environment (Rails 3.2.3)
>> helper.number_to_currency(100)
=> "$100.00"
>> helper.time_ago_in_words(3.days.ago)
=> "3 days"
{% endsh %}

### 5. 开发模式用 thin 代替 webrick

{% sh [:ruby] %}

group :development do
  gem 'thin'
end

rails s thin / thin start

{% endsh %}

### 6. 允许自定义配置

{% sh [:ruby] %}

 - lib/custom/railtie.rb

 module Custom
   class Railtie < Rails::Railtie
     config.custom = ActiveSupport::OrderedOptions.new
   end
 end

 - config/application.rb

 require_relative "../lib/custom/railtie"

 module Blog
   class Application < Rails::Application
     # ...
     config.custom.setting = 42
   end
 end
{% endsh %}

### 7. keep funny

作者给出了个介绍 ruby 以及一些相关 blog的网站 rubydramas，搞笑的是这个网站右上角标明



{% sh [:ruby] %}

Powered by PHP
{% endsh %}

用 isitrails.com 检查了下，果然不是用 rails 做的，这个应该是作者分享 ppt 过程中的一个小插曲吧

### 8. 理解简写的迁移文件

{% sh [:ruby] %}
rails g resources user name:string email:string token:string bio:text
{% endsh %}

字段会被默认为 string 属性，查看了下 源码，果然有初始化定义

{% sh [:ruby] %}
rails g resources user name email token:string{6} bio:text
{% endsh %}

会生成用样的 migration 文件

{% sh [:ruby] %}

class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :token, :limit => 6
      t.text :bio
      t.timestamps
    end
  end
end
{% endsh %}

### 9.  给 migration 添加索引
{% sh [:ruby] %}
rails g resource user name:index email:uniq token:string{6} bio:text
{% endsh %}

会生成 name 和 email 的索引，同时限定 email 唯一

{% sh [:ruby] %}
class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :token, :limit => 6
      t.text :bio
      t.timestamps
    end

    add_index :users, :name
    add_index :users, :email, :unique => true
  end
end
{% endsh %}

### 10.  添加关联关系

{% sh [:ruby] %}
rails g resource article user:references subject body:text
{% endsh %}

会自动关联生成对应的 belongs_to 和 外键，并添加索引

{% sh [:ruby] %}

class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.references :user
      t.string :subject
      t.text :body
      t.timestamps
    end
    add_index :articles, :user_id
  end
end

{% endsh %}

{% sh [:ruby] %}

class Article < ActiveRecord::Base
  belongs_to :user
  attr_accessible :body, :subject
end

{% endsh %}

### 11. 显示数据迁移记录
{% sh [:ruby] %}
  rake db:migrate:status
{% endsh %}

会输出 migration 的状态，这在解决迁移版本冲突的时候很有用

{% sh [:ruby] %}

database: db/development.sqlite3

 status   Migration ID    Migration Name
 ---------------------------------------
   up     20120414155612  Create users
   up     20120414160528  Create articles
  down    20120414161355  Create comments
{% endsh %}

### 12.  导入 csv 文件

csv 文件内容如下

{% sh [:ruby] %}

Name,Email
James,james@example.com
Dana,dana@example.com
Summer,summer@example.com

{% endsh %}

创建 rake 任务导入 users 表

{% sh [:ruby] %}

require 'csv'
namespace :users do
  desc "Import users from a CSV file"
  task :import => :environment do
    path = ENV.fetch("CSV_FILE") {
      File.join(File.dirname(__FILE__), *%w[.. .. db data users.csv])
    }
    CSV.foreach(path, headers: true, header_converters: :symbol) do |row|
      User.create(row.to_hash)
    end
  end
end
{% endsh %}

### 13. 数据库中储存 csv

{% sh [:ruby] %}
class Article <  ActiveRecord::Base
  require 'csv'
  module CSVSerializer
    module_function
    def load(field); field.to_s.parse_csv; end
    def dump(object); Array(object).to_csv; end
  end
  serialize :categories, CSVSerializer

  attr_accessible :body, :subject, :categories
end
{% endsh %}

serialize 用于在文本字段储存序列化的值，如序列，Hash，Array等，例如

{% sh [:ruby] %}
user = User.create(:preferences => { "background" => "black", "display" => large })
User.find(user.id).preferences # => { "background" => "black", "display" => large }
{% endsh %}

这个例子中将 CSVSerializer to_csv序列化之后储存在 categories 这个文本类型字段中

### 14.用 pluck 查询

{% sh [:ruby] %}
$ rails c
loading development environment(Rails 3.2.3)

>> User.select(:email).map(&:email)
  User Load(0.1ms) SELECT email FROM "users"
=> ["james@example.com", "dana@example.com", "summer@example.com"]
>> User.pluck(:email)
   (0.2ms) SELECT email FROM "users"
=> ["james@example.com", "dana@example.com", "summer@example.com"]
>> User.uniq.pluck(:email)
   (0.2ms) SELECT DISTINCT email FROM "users"
=> ["james@example.com", "dana@example.com", "summer@example.com"]
{% endsh %}

pluck 的实现方式其实也是 select 之后再 map

{% sh [:ruby] %}
def pluck(column_name)
  column_name = column_name.to_s
  klass.connection.select_all(select(column_name).arel).map! do |attributes|
    klass.type_cast_attribute(attributes.keys.first, klass.initialize_attributes(attributes))
  end
end
{% endsh %}
### 15.使用 group count

创建 article 关联 model event

{% sh [:ruby] %}
rails g resource e
vent article:belongs_to triggle
{% endsh %}

创建3条 edit 记录和10条 view 记录。 Event.count 标明有13条记录， 

group(:triggle).count 表示统计 triggle group 之后的数量，也可以用 count(:group => :trigger)

{% sh [:ruby] %}
$ rails c
>> article = Article.last
=> #<Article id:1, ...>
>> {edit:3, view:10}.each do |trigger, count|
?>   count.times do
?>     Event.new(trigger: trigger).tap{ |e| e.article= article; e.save! }
?>   end
=> {:edit => 3, :view => 10}
>> Event.count
=> 13
>> Event.group(:trigger).count
=> {"edit" => 3, 
"view" => 10}
{% endsh %}

### 16.  覆盖关联关系

{% sh [:ruby] %}

class Car < ActiveRecord::Base
  belongs_to :owner
  belongs_to :previous_owner, class_name: "Owner"

  def owner=(new_owner)
    self.previous_owner = owner
    super
  end
end
{% endsh %}

car更改 owner 时，如果有了 new_owner，就把原 owner 赋给 previous_owner，注意要加上 super

### 17.  构造示例数据

{% sh [:ruby] %}
$ rails c
Loading development environment (Rails 3.2.3)
>> User.find(1)
=> #<User id: 1, name: "James", email: "
￼￼￼￼￼￼￼james@example.com", ...>
￼￼￼￼￼>> jeg2 = User.instantiate("id" => 1, "email" => "
￼￼￼￼=> #<User id: 1, email: "james@example.com">
>> jeg2.name = "James Edward Gray II"
￼￼￼￼=> "James Edward Gray II"
>> jeg2.save!
=> true
>> User.find(1)
￼￼￼￼￼￼james@example.com", ...>
{% endsh %}

伪造一条记录，并不是数据库中的真实数据，也不会把原有数据覆盖

### 18. - PostgreSQL 中使用无限制的 string

去掉适配器中对 string 长度的限制，这个应该是 PostgreSQL 数据库的特性
{% sh [:ruby] %}
module PsqlApp
  class Application < Rails::Application
    # Switch to limitless strings
    initializer "postgresql.no_default_string_limit" do
      ActiveSupport.on_load(:active_record) do
        adapter = ActiveRecord::ConnectionAdapters::PostgreSQLAdapter
        adapter::NATIVE_DATABASE_TYPES[:string].delete(:limit)
      end
    end
 end
end
{% endsh %}

创建 user 表，bio 字符串

{% sh [:ruby] %}
rails g resource user bio
{% endsh %}

{% sh [:ruby] %}
$ rails c
Loading development environment (Rails 3.2.3)
>> very_long_bio = "X" * 10_000; :set
=> :set
>> User.create!(bio: very_long_bio)
=> #<User id: 1, bio:
"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XX...", created_at: "2012-04-14 23:02:08",
updated_at: "2012-04-14 23:02:08">
>> User.last.bio.size
=> 10000
{% endsh %}

### 19. - PostgreSQL 中使用全文搜索

{% sh [:ruby] %}
rails g resource article subject body:text
{% endsh %}

更改迁移文件，添加索引和 articles_search_update 触发器

{% sh [:ruby] %}
class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :subject
      t.text   :body
      t.column :search, "tsvector"
      t.timestamps
    end
    execute <<-END_SQL
      CREATE INDEX articles_search_index
      ON articles USING gin(search);
      CREATE TRIGGER articles_search_update
      BEFORE INSERT OR UPDATE ON articles
      FOR EACH ROW EXECUTE PROCEDURE
      tsvector_update_trigger( search, 'pg_catalog.english', subject, body);
    END_SQL
  end
end
{% endsh %}

Model 中添加 search 方法

{% sh [:ruby] %}
class Article < ActiveRecord::Base
  attr_accessible :body, :subject
  def self.search(query)
    sql = sanitize_sql_array(["plainto_tsquery('english', ?)", query])
    where(
      "search @@ #{sql}"
    ).order(
      "ts_rank_cd(search, #{sql}) DESC"
    )
end end
{% endsh %}

PostgreSQL 数据库没用过，这段看例子吧

{% sh [:ruby] %}
$ rails c
Loading development environment (Rails 3.2.3)
>> Article.create!(subject: "Full Text Search")
=> #<Article id: 1, ...>
>> Article.create!(body: "A stemmed search.")
=> #<Article id: 2, ...>
>> Article.create!(body: "You won't find me!")
=> #<Article id: 3, ...>
>> Article.search("search").map { |a| a.subject || a.body }
=> ["Full Text Search", "A stemmed search."]
>> Article.search("stemming").map { |a| a.subject || a.body }
=> ["A stemmed search."]
{% endsh %}

### 21. 每个用户使用不同的数据库

{% sh [:ruby] %}
- user_database.rb

def connect_to_user_database(name)
  config = ActiveRecord::Base.configurations["development"].merge("database" => "db/#{name}.sqlite3")
  ActiveRecord::Base.establish_connection(config)
end
{% endsh %}

创建 rake 任务：新增用户数据库和创建

{% sh [:ruby] %}
require "user_database"

namespace :db do
  desc "Add a new user database"
  task :add => %w[environment load_config] do
    name = ENV.fetch("DB_NAME") { fail "DB_NAME is required" }
    connect_to_user_database(name)
    ActiveRecord::Base.connection
  end

  namespace :migrate do
    desc "Migrate all user databases"
    task :all => %w[environment load_config] do
      ActiveRecord::Migration.verbose = ENV.fetch("VERBOSE", "true") == "true"
      Dir.glob("db/*.sqlite3") do |file|
        next if file == "db/test.sqlite3"
        connect_to_user_database(File.basename(file, ".sqlite3"))
        ActiveRecord::Migrator.migrate(
          ActiveRecord::Migrator.migrations_paths,
          ENV["VERSION"] && ENV["VERSION"].to_i
        ) do |migration|
          ENV["SCOPE"].blank? || (ENV["SCOPE"] == migration.scope)
        end
      end
    end
  end
end
{% endsh %}

执行几个rake 任务创建不同的数据库

{% sh [:ruby] %}
$ rails g resource user name
$ rake db:add DB_NAME=ruby_rogues
$ rake db:add DB_NAME=grays
$ rake db:migrate:all
==  CreateUsers: migrating ==================================
-- create_table(:users)
   -> 0.0008s
==  CreateUsers: migrated (0.0008s) =========================
==  CreateUsers: migrating ==================================
-- create_table(:users)
   -> 0.0007s
==  CreateUsers: migrated (0.0008s) =========================
{% endsh %}

创建几条记录，为不同的数据库创建不同的数据

{% sh [:ruby] %}
$ rails c
>> connect_to_user_database("ruby_rogues")
=> #<ActiveRecord::ConnectionAdapters::ConnectionPool...>
>> User.create!(name: "Chuck")
=> #<User id: 1, name: "Chuck", ...>
>> User.create!(name: "Josh")
=> #<User id: 2, name: "Josh", ...>
>> User.create!(name: "Avdi")
=> #<User id: 3, name: "Avdi", ...>
...
>> connect_to_user_database("grays")
=> #<ActiveRecord::ConnectionAdapters::ConnectionPool...>
>> User.create!(name: "James")
=> #<User id: 1, name: "James", ...>
>> User.create!(name: "Dana")
=> #<User id: 2, name: "Dana", ...>
>> User.create!(name: "Summer")
=> #<User id: 3, name: "Summer", ...>
{% endsh %}

ApplicationController 里面添加 before_filter 根据登陆的二级域名判断连接哪个数据库

{% sh [:ruby] %}
class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :connect_to_database
private
  def connect_to_database
    connect_to_user_database(request.subdomains.first)
  end
end
{% endsh %}

### 21. 自动写文件

{% sh [:ruby] %}
class Comment < ActiveRecord::Base
  # ...
  Q_DIR = (Rails.root + "comment_queue").tap(&:mkpath)
  after_save :queue_comment
  def queue_comment
    File.atomic_write(Q_DIR + "#{id}.txt") do |f|
      f.puts "Article: #{article.subject}"
      f.puts "User:    #{user.name}"
      f.puts body
    end
  end
end
{% endsh %}

找了下 Api 是 Rails 对 Ruby 基础类的扩展

### 22. 合并嵌套 Hash

{% sh [:ruby] %}
$ rails c
Loading development environment (Rails 3.2.3)
>> {nested: {one: 1}}.merge(nested: {two: 2})
=> {:nested=>{:two=>2}}
>> {nested: {one: 1}}.deep_merge(nested: {two: 2})
=> {:nested=>{:one=>1, :two=>2}}
{% endsh %}

主要是用到了 deep_merge 合并相同的 key

### 23.  Hash except

{% sh [:ruby] %}
$ rails c
Loading development environment (Rails 3.2.3)
>> params = {controller: "home", action: "index", from: "Google"}
=> {:controller=>"home", :action=>"index", :from=>"Google"}
>> params.except(:controller, :action)
=> {:from=>"Google"}
{% endsh %}

这个方法经常会用到，可能用的人也很多

### 24. add defaultss to Hash

{% sh [:ruby] %}
$ rails c
Loading development environment (Rails 3.2.3)
>> {required: true}.merge(optional: true)
=> {:required=>true, :optional=>true}
>> {required: true}.reverse_merge(optional: true)
=> {:optional=>true, :required=>true}
>> {required: true, optional: false}.merge(optional: true)
=> {:required=>true, :optional=>true}
>> {required: true, optional: false}.reverse_merge(optional: true)
=> {:optional=>false, :required=>true}
{% endsh %}

这几个都是对 Hash 类的增强，merge 会替换原有相同 key 的值，但 reverse_merge 不会

从源码就可以看出，会事先 copy 一份 default hash

{% sh [:ruby] %}
def reverse_merge(other_hash)
  super
  self.class.new_from_hash_copying_default(other_hash)
end
{% endsh %}

### 25. String.value? 方法

看下面的几个例子

{% sh [:ruby] %}
$ rails c
Loading development environment (Rails 3.2.3)
>> env = Rails.env
=> "development"
>> env.development?
=> true
>> env.test?
=> false
>> "magic".inquiry.magic?
=> true
>> article = Article.first
=> #<Article id: 1, ..., status: "Draft">
>> article.draft?
=> true
>> article.published?
=> false
{% endsh %}

env, “magic” 可以直接使用 value? 的方法，这个扩展是 String#inquiry 方法

{% sh [:ruby] %}
def inquiry
  ActiveSupport::StringInquirer.new(self)
end
{% endsh %}

### 用method_missing 实现

{% sh [:ruby] %}
def method_missing(method_name, *arguments)
  if method_name.to_s[-1,1] == "?"
    self == method_name.to_s[0..-2]
  else
    super
  end
end
{% endsh %}

类型的一个例子，同样用到了 inquiry 方法

{% sh [:ruby] %}
class Article < ActiveRecord::Base
  # ...
  STATUSES = %w[Draft Published]
  validates_inclusion_of :status, in: STATUSES
  def method_missing(method, *args, &block)
    if method =~ /\A#{STATUSES.map(&:downcase).join("|")}\?\z/
      status.downcase.inquiry.send(method)
    else
      super
    end
  end
end
{% endsh %}

### 26. - 让你成为杂志的封面 （暖场之用）

搞笑哥拿出了 DHH 当选 Linux journal 杂志封面的图片，会场也是哄堂大笑 ^.^

![DHH Linux Journal](http://www.rubyinside.com/wp-content/uploads/2006/05/dhh.png)

### 27. - 隐藏用户评论

{% sh [:ruby] %}
<!-- HTML comments stay in the rendered content -->
<%# ERb comments do not %>
<h1>Home Page</h1>

# 生成的 html
<body>
<!-- HTML comments stay in the rendered content -->
<h1>Home Page</h1>
</body>
{% endsh %}


这个一下没看懂。。试了下项目里面的代码，原来是隐藏的意思。。

### 28. 理解更短的 erb 语法

{% sh [:ruby] %}
# ...
module Blog
  class Application < Rails::Application

    # Broken:  config.action_view.erb_trim_mode = '%'
    ActionView::Template::Handlers::ERB.erb_implementation =
      Class.new(ActionView::Template::Handlers::Erubis) do
        include ::Erubis::PercentLineEnhancer
      end
    ￼￼￼￼end
  end
end
{% endsh %}

接着在 view 页面替换用 % 表示原来 <% if %> <% end %>，有点像 slim

{% sh [:ruby] %}
% if current_user.try(:admin?)
  <%= render "edit_links" %>
% end
{% endsh %}

### 29. 用 block 避免视图层赋值

{% sh [:ruby] %}

<table>
  <% @cart.products.each do |product| %>
    <tr>
      <td><%= product.name %></td>
      <td><%= number_to_currency product.price %></td>
    </tr>
  <% end %>
  <tr>
    <td>Subtotal</td>
    <td><%= number_to_currency @cart.total %></td>
  </tr> 
  <tr>
    <td>Tax</td>
    <td><%= number_to_currency(tax = calculate_tax(@cart.total)) %></td>
  </tr>
  <tr>
    <td>Total</td>
    <td><%= number_to_currency(@cart.total + tax) %></td>
  </tr>
</table>
tax = calculate_tax(@cart.total) 会先被赋值再被下面引用

{% endsh %}

用 block 重构下，把逻辑代码放到 helper 里面

{% sh [:ruby] %}
module CartHelper
  def calculate_tax(total, user = current_user)
    tax = TaxTable.for(user).calculate(total)
    if block_given?
      yield tax
    else
      tax
    end
  end
end
{% endsh %}

{% sh [:ruby] %}
<table>
  <% @cart.products.each do |product| %>
    <tr>
      <td><%= product.name %></td>
      <td><%= number_to_currency product.price %></td>
    </tr>
  <% end %>
  <tr>
    <td>Subtotal</td>
    <td><%= number_to_currency @cart.total %></td>
  </tr>
  <% calculate_tax @cart.total do |tax| %>
    <tr>
      <td>Tax</td>
      <td><%= number_to_currency tax %></td>
    </tr> 
    <tr>
      <td>Total</td>
      <td><%= number_to_currency(@cart.total + tax) %></td>
    </tr>
  <% end %>
</table>
{% endsh %}

### 30 同时生成多个标签

{% sh [:ruby] %}
<h1>Articles</h1>
  <% @articles.each do |article| %>
    <%= content_tag_for(:div, article) do %>
    <h2><%= article.subject %></h2>
  <% end %>
<% end %>
{% endsh %}

{% sh [:ruby] %}
<%= content_tag_for(:div, @articles) do |article| %>
  <h2><%= article.subject %></h2>
<% end %>
{% endsh %}

### 31 Render Any Object

{% sh [:ruby] %}
class Event < ActiveRecord::Base
  # ...
  def to_partial_path
    "events/#{trigger}"  # events/edit or events/view
  end
end
<%= render partial: @events, as: :event %>
{% endsh %}

to_partial_path 是 ActiveModel 內建的实例方法，返回一个和可识别关联对象路径的字符串，原文是这么说的，目前还没看明白这么用的目的在哪

{% sh [:ruby] %}
Returns a string identifying the path associated with the object.
ActionPack uses this to find a suitable partial to represent the object.
{% endsh %}

### 32.  生成 group option

{% sh [:ruby] %}
<%= select_tag( :grouped_menu, grouped_options_for_select(
  "Group A" => %w[One Two Three],
  "Group B" => %w[One Two Three]
) ) %>
{% endsh %}

这个其实就是用到了 grouped_options_for_select ，我在前面的 博文 提到过这几个 select 的用法

### 33. 定制你自己喜欢的 form 表单

{% sh [:ruby] %}
class LabeledFieldsWithErrors < ActionView::Helpers::FormBuilder
  def errors_for(attribute)
    if (errors = object.errors[attribute]).any?
      @template.content_tag(:span, errors.to_sentence, class: "error")
    end
  end
  def method_missing(method, *args, &block)
    if %r{ \A (?<labeled>labeled_)?
              (?<wrapped>\w+?)
              (?<with_errors>_with_errors)? \z }x =~ method and
       respond_to?(wrapped) and [labeled, with_errors].any?(&:present?)
      attribute, tags = args.first, [ ]
      tags           << label(attribute) if labeled.present?
      tags           << send(wrapped, *args, &block)
      tags           << errors_for(attribute) if with_errors.present?
      tags.join(" ").html_safe
    else
      super
    end
  end
end
{% endsh %}

定义了几个不想去看懂的 method_missing 方法。。 修改 application.rb，添加配置

{% sh [:ruby] %}
class Application < Rails::Application
  # ...
  require "labeled_fields_with_errors"
  config.action_view.default_form_builder = LabeledFieldsWithErrors
  config.action_view.field_error_proc     = ->(field, _) { field }
end
{% endsh %}

创建 form 表单可以这样书写

{% sh [:ruby] %}
<%= form_for @article do |f| %>
  <p><%= f.text_field
  <p><%= f.labeled_text_field
  <p><%= f.text_field_with_errors
  <p><%= f.labeled_text_field_with_errors :subject %></p>
  <%= f.submit %>
<% end %>
{% endsh %}

生成如下的 html 页面

{% sh [:ruby] %}
<p><input id="article_subject" name="article[subject]" size="30" type="text" value="" /></p>
<p><label for="article_subject">Subject</label>
   <input id="article_subject" name="article[subject]" size="30" type="text" value="" /></p>
<p><input id="article_subject" name="article[subject]" size="30" type="text" value="" />
   <span class="error">can't be blank</span></p>
<p><label for="article_subject">Subject</label>
   <input id="article_subject" name="article[subject]" size="30" type="text" value="" />
   <span class="error">can't be blank</span></p>
<!-- ... -->
{% endsh %}

不是很喜欢这种方式，反而把简单的html搞复杂了，让后来维护的人增加额外的学习成本

### 34. Inspire theme songs about your work (再次暖场时刻)

2011年 Farmhouse Conf 上主持人 Ron Evans 专门用口琴演奏了为大神 Tenderlove 写的歌 - Ruby Hero Tenderlove! ，听了半天不知道唱的啥。。

想找下有没有美女 Rubist, 看了下貌似没有，都是大妈，这位 Meghann Millard 尚可远观，大姐装束妖娆，手握纸条，蚊蝇环绕，不时微笑，长的真有点像 gossip girl 里面的 Jenny Humphrey

### 35.  灵活的异常操作

修改 application.rb 定义
{% sh [:ruby] %}
class Application < Rails::Application
# ...
  config.exceptions_app = routes
end
{% endsh %}

每次有异常时路由都会被调用，你可以用下面的方法简单 render 404 页面

{% sh [:ruby] %}
match "/404", :to => "errors#not_found"
{% endsh %}

这个例子也在开头提到的那篇博文里面，感兴趣可以去自己研究下

### 36.   给 Sinatra 添加路由

{% sh [:ruby] %}

- Gemfile

source 'https://rubygems.org'
# ...
gem "resque", require: "resque/server"



module AdminValidator

  def matches?(request)
    if (id = request.env["rack.session"]["user_id"])
      current_user = User.find_by_id(id)
      current_user.try(:admin?)
    else
      false
    end
  end
end
{% endsh %}
挂载 Resque::Server 至 /admin/resque
{% sh [:ruby] %}
  # ...
  require "admin_validator"
  constraints AdminValidator do
    mount Resque::Server, at: "/admin/resque"
  end
end
{% endsh %}
这个也没有试验，不清楚具体用法，sinatra 平时也基本不用

###　37. 导出CSV流

{% sh [:ruby] %}

class ArticlesController < ApplicationController
  def index
    respond_to do |format|
      format.html do
        @articles = Article.all
      end
      format.csv do
        headers["Content-Disposition"] = %Q{attachment; filename="articles.csv"}
        self.response_body = Enumerator.new do |response|
          csv  = CSV.new(response, row_sep: "\n")
          csv << %w[Subject Created Status]
          Article.find_each do |article|
            csv << [ article.subject,
                     article.created_at.to_s(:long),
                     article.status ]
        ￼￼	end
        end
      end
    end
  end
# ...
end
{% endsh %}

导出 csv 是很常用的功能，很多时候报表都需要，这个还是比较实用的

### 38.  do some work in the background

给 articles 添加文本类型 stats 字段

{% sh [:ruby] %}
rails g migration add_stats_to_articles stats:text
{% endsh %}

添加一个计算 stats 方法 和 一个 after_create 方法，在创建一条记录后，会把 calculate_stats 添加到 Queue 队列，当队列中有任务时，后台创建一个线程执行该 job

{% sh [:ruby] %}
class Article < ActiveRecord::Base
  # ...
  serialize :stats
  def calculate_stats
    words = Hash.new(0)
    body.to_s.scan(/\S+/) { |word| words[word] += 1 }
    sleep 10  # simulate a lot of work
    self.stats = {words: words}
  end

  require "thread"
  def self.queue; @queue ||= Queue.new end
  def self.thread
    @thread ||= Thread.new do
      while job = queue.pop
        job.call
      end
    end
  end
  thread  # start the Thread

  after_create :add_stats
  def add_stats
    self.class.queue << -> { calculate_stats; save }
  end
end
{% endsh %}

添加一条记录，10秒后会自动给该记录 stats 字段添加 words Hash

{% sh [:ruby] %}

$ rails c
Loading development environment (Rails 3.2.3)
>> Article.create!(subject: "Stats", body: "Lorem ipsum...");
Time.now.strftime("%H:%M:%S")
=> "15:24:10"
>> [Article.last.stats, Time.now.strftime("%H:%M:%S")]
=> [nil, "15:24:13"]
>> [Article.last.stats, Time.now.strftime("%H:%M:%S")]
=>[{:words=>{"Lorem"=>1, "ipsum"=>1, ...}, "15:24:26"]
{% endsh %}

### 39. 用 Rails 生成静态站点

修改 config/environment/development.rb

{% sh [:ruby] %}

require "open-uri"
namespace :static do
  desc "Generate a static copy of the site"
  task :generate => %w[environment assets:precompile] do
    site = ENV.fetch("RSYNC_SITE_TO") { fail "Must set RSYNC_SITE_TO" }
    server = spawn( {"GENERATING_SITE" => "true"},
                    "bundle exec rails s thin -p 3001" )
    sleep 10  # FIXME: start when the server is up

    # FIXME: improve the following super crude spider
    paths = %w[/]
    files = [ ]
    while path = paths.shift
      files << File.join("public", path.sub(%r{/\z}, "/index") + ".html")
      File.unlink(files.last) if File.exist? files.last
      files << files.last + ".gz"
      File.unlink(files.last) if File.exist? files.last
      page = open("http://localhost:3001#{path}") { |url| url.read }
      page.scan(/<a[^>]+href="([^"]+)"/) do |link|
        paths << link.first
      end
    end

    system("rsync -a public #{site}")

    Process.kill("INT", server)
    Process.wait(server)
    system("bundle exec rake assets:clean")
    files.each do |file|
      File.unlink(file)
    end
  end
end
{% endsh %}

生成到某个地方，去查看吧

{% sh [:ruby] %}
rake static:generate RSYNC_SITE_TO=/Users/james/Desktop
{% endsh %}
