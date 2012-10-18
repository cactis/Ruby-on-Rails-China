---
layout: post
title: "GEM by_star简易教程 + 实例"
date: 2012-10-17 22:29
comments: true
categories: Ruby-China
author: JeskTop
---
转载自[Ruby-China](http://ruby-china.org/topics/2151)
**by\_star**\
 是一个辅助 ActiveRecord
的组件，让你可以简单的实现按某年，某月，某日，或者星期几，来查询数据，用起来非常简单，省下麻烦的条件组合，此外，它还可以查询上一篇，下一篇类似的功能。\
 下面我结合它所生成的SQL语句，来简单介绍一下这个GEM的大部分方法的用法。

注：目前我电脑上时间为2012年3月26日，16：21，系统为ubuntu11.10\
**1.Book.by\_year(2012)**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-01-01 00:00:00.000000' AND books.created_at <= '2012-12-31 23:59:59.999999')

顾名思义，就是根据年份进行搜索范围

**2.[*@*books](/books "@books").count\_by\_year('name')**\
 注：[*@*books](/books "@books") = Book.all 既books表中的name列\
 生成SQL语句

    SELECT COUNT("books"."name") FROM "books" WHERE (books.created_at >= '2012-01-01 00:00:00.000000' AND books.created_at <= '2012-12-31 23:59:59.999999') 

对该数据标中的name一列的行数是多少，并可以设置年份或者月份范围，详情见最后的参考文献

**3.[*@*books](/books "@books").sum\_by\_year('name')**\
 生成SQL语句

    SELECT SUM("books"."name") AS sum_id FROM "books" WHERE (books.created_at >= '2012-01-01 00:00:00.000000' AND books.created_at <= '2012-12-31 23:59:59.999999') 

对该数据标中的name一列，里面数据的总和，并可以设置年份或者月份范围，详情见最后的参考文献

**4.Book.by\_month(3)**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-01 00:00:00.000000' AND books.created_at <= '2012-03-31 23:59:59.999999')

顾名思义，就是根据月份进行搜索范围

**5.Book.by\_fortnight**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-26 00:00:00.000000' AND books.created_at <= '2012-04-09 00:00:00.000000')

搜索从今天起，往后的2个星期内的数据

**6.Book.by\_week**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-04-01 00:00:00.000000' AND books.created_at <= '2012-04-08 00:00:00.000000') 

下一周的数据

**7.Book.by\_weekend(Time.now)**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-30 07:00:00.000000' AND books.created_at <= '2012-03-31 15:59:59.999999')

即将到来的周末时间

**8.Book.today**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-26 00:00:00.000000' AND books.created_at <= '2012-03-26 23:59:59.999999')

当天时间，也就算today

**9.Book.by\_current\_weekend**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-30 15:00:00.000000' AND books.created_at <= '2012-04-02 03:00:00.000000')

如果你在工作日的时候范围将是（3pm 星期5 之间 3am 星期1)\
 如果你在周末的时候，范围将是（3am 星期1 之间 3pm 星期5）

**10.Book.by\_current\_work\_week**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-26 03:00:00.000000' AND books.created_at <= '2012-03-30 15:00:00.000000') 

工作日的范围，与by\_current\_weekend相反

**11.Book.tomorrow(Date.today + 2)**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-29 00:00:00.000000' AND books.created_at <= '2012-03-29 23:59:59.999999')

在没有参数的情况下为第二天，因为在参数使用了Date.today +
2，所以范围变成了27+2

**12.Book.yesterday(Time.now + 5.days)**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-29 16:00:00.000000' AND books.created_at <= '2012-03-30 15:59:59.999999')

昨天所生成的数据，在这里参数设置为Time.now +
5.days，所以范围在29-30号，Time.now包含了当前的时刻

**13.Book.past**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at < '2012-03-26 08:35:58.965390')

此时此刻之前的时间段

**14.Book.future**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at > '2012-03-26 08:37:08.885779')

此时此刻之后的时间段

**15.Book.between("last tuesday", Date.today)**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-20 04:00:00.000000' AND books.created_at <= '2012-03-26 00:00:00.000000')

自己定义时间范围段，本例子的时间段为上个星期2到今天

**16.Book.as\_of\_2\_weeks\_ago**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-12 08:41:13.847107' AND books.created_at <= '2012-03-26 08:41:13.879807')

as*of*是意思从某个时间段至今，本例子是设置了2个星期之前到今天

**17.Book.up\_to\_6\_weeks\_from\_now**\
 生成SQL语句

    SELECT "books".* FROM "books" WHERE (books.created_at >= '2012-03-26 08:42:05.754650' AND books.created_at <= '2012-05-07 08:42:05.751732')

up*to*和as*of*相反，就是至从今天一直到将来某个时候

这里除了Previous (previous)和Next
(next)外，对时间范围设置的已经基本介绍清楚，基本每个方法可以设置参数的，但是由于这样会相当庞大，太多东西需要描述了，所以这里就不多做解释啦。详细的，在by\_star中README有很详细的介绍，网址如下：\
[http://rubydoc.info/gems/by\_star/1.0.1/frames](http://rubydoc.info/gems/by_star/1.0.1/frames)

**------------------------------------------------------------------------------------------------------------------------**\
 下面，我这里大概的介绍一下我写的一个使用by\_star的简单例子：\
 CRUD通过Scaffold生成之后，对生成的本分，进行简单的编辑。\

我的思路是，我建立一个搜索框，输入月份，然后进行搜索，根据表中的销售时间（sale）进行塞选范围，在index.html.erb中增加一个搜索框，HTML代码如下：

    <%= form_tag('index', :method =>'get') do %>
      <%= label_tag :month, "按月份查询:" %>
      <%= text_field_tag :month %>
      <%= submit_tag "Search" %>
    <% end %>

搜索结果将会也在index.html.erb中显示，代码直接通过脚手架生成，没有做更改，如下：

    <% @books.each do |book| %>
      <tr>
        <td><%= book.name %></td>
        <td><%= book.sale %></td>
        <td><%= link_to 'Show', book %></td>
        <td><%= link_to 'Edit', edit_book_path(book) %></td>
        <td><%= link_to 'Destroy', book, confirm: 'Are you sure?', method: :delete %></td>
      </tr>
    <% end %>

好了，现在我们看看controller增加了些什么。\
 只是对books中的index方法稍作了修改，整个index的代码如下：

    def index

      if params[:month]   #判断是直接打开首页，还是进行了搜索
        @books = Book.by_month(params[:month].to_i, :field => 'sale') 
        # 根据月份进行范围筛选，作用域在‘sale’上，如果:field不设置的话，默认是创建时间
      else
        @books = Book.as_of_2_weeks_ago
        # 如果没有搜索的情况下，将默认显示2个星期前的数据信息
      end

      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @books }
      end
    end

还有routes.rb中的代码

      root :to => 'books#index'
      resources :books
      get "index" => "books#index", :as => "index"  #因为我搜索条到index

这是这2天里，学习by\_star的小小心得，希望可以方便别人学习，因为我是Rails的初学者，英语不太好，所以一开始看这个gem的文档觉得很吃力，因为没有学习的例子参考，所以为了大家提高学习效率，所以我在这里写下了学习的心得，希望新手们可以更加高效。\
 不过不知道例子写的好不好，希望有大牛可以指点一下。

以后大牛教大家牛的知识，我就写写心得，写写很简单的教程，让新手学习不走弯路，可以更有信心。

3Q\~

参考：\
[http://rubygems.org/gems/by\_star](http://rubygems.org/gems/by_star)\
[http://rubydoc.info/gems/by\_star/1.0.1/frames](http://rubydoc.info/gems/by_star/1.0.1/frames)
