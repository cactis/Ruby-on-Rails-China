---
layout: post
title: "Rails3.2.8 Route源码分析"
date: 2012-10-18 11:49
comments: true
categories: RubyChina
author: lyfi2003
---
转载自[Ruby-China](http://ruby-china.org/topics/5895)
#### Rails3.2.8 Route源码分析

#### 热热身, 准备工具与分析方法

开始之前, 进入到我们的主要目录: `actionpack-3.2.8/action_dispatch` .

看看`routing.rb` 吧, 在 模块`ActionDispatch::Routing`下,如下关键代码 :

    autoload :Mapper, 'action_dispatch/routing/mapper'
    autoload :RouteSet, 'action_dispatch/routing/route_set'
    autoload :RoutesProxy, 'action_dispatch/routing/routes_proxy'
    autoload :UrlFor, 'action_dispatch/routing/url_for'
    autoload :PolymorphicRoutes, 'action_dispatch/routing/polymorphic_routes'

使用 `autoload` 是为了加载更快速一些, 我们知道 `require`
是一个慢速的过程, 从这里, 我们知道了需要分析的模块名.

我们先准备工具, 一个记事本和一个 `grep` 工具, 记事本我使用了 `textmate`,
比较方便看代码, 这个 `grep` 我使用了 `rak`, 你可以使用 `gem install rak`
安装. 我们分析的代码是 Rails3.2.8, 你可以使用
`gem install rails --version '3.2.8'` 安装.

我们采用主要静态+少量动态的方式进行.

你还需要对 Rails3 的 `route` 有较多了解, 如不然, 看这里:
[http://guides.rubyonrails.org/routing.html](http://guides.rubyonrails.org/routing.html)

工具准备后, 我们了解一下 `route` 在 `application.rb` 的地位.

`railties-3.2.8` 中 `rails/application.rb:26` :

      # == Routes                                                                                                                                                            
      #
      # The application object is also responsible for holding the routes and reloading routes
      # whenever the files change in development.
      #
      # == Middlewares
      #
      # The Application is also responsible for building the middleware stack.

`delegate.rb` 关于方法代理, 你需要看看:

[https://github.com/rails/rails/blob/master/activesupport/lib/active\_support/core\_ext/module/delegation.rb](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/core_ext/module/delegation.rb)

另外, 对 `active_support` 有越多了解越好, 不过遇到问题再查 `google`
是我们常用的伎俩, 对吧…

最后, 保持 `耐心`, 不断 `推测` 与 `怀疑`, 可以开始了.

#### RouteSet 领导的气息

我们折叠下代码.\
 先看 `route_set.rb`, 这名字一看就不简单, "路由集合", 嗯,
很可能是最关键的东西. 我们看看它的内容:

折叠一下 `RouteSet`, 嗯, 只有一个 `RouteSet`,
这个作者很老实嘛.看样子很好分析(也说明这个类极其重要). 我们再展开它,
里面还隐藏了几个类中类: `Dispatcher`(粗看是个分发器,后面还加了 :nodoc:,
感觉是供外层调用中转的,我们先记下,不理它了先. )
(看代码时,英文常识非常重要,
Dispatcher一般就是个核心中转站,负责将调用转至相关模块),
`NamedRouteCollection`(具名路由集合,嗯,暂时不管), 然后我们看到了
`RouteSet` 的 `initialize` 方法, 咋一看, 好像啥都不懂, 别慌,
无非就是设一堆初始参数嘛, 不过最后有一个 `Journey`, 用到了 `Routes` 与
`Router`, 莫名其… 等等, `rak Journey` 搜一下,我们发现, `Journey`
是外部引入的, 我们就顺路到 `https://github.com/rails/journey` 看两眼,
说明书上说 它是一个路由器,路由请求.再看简介, Too complex right now. NND,
这作者想忽悠咱不成, 我们时间有限, 看看测试集吧, `test/*` 大概看懂了,
无非就是处理一堆正则,前缀,后缀… 反正是挺复杂的. 还好不是我们在写它,
回来吧. 目前我们记得一件事,

    @set = Journey::Routes.new
    alias :routes :set

再往下看, 就到了 `draw` 了, 我们一惊, 这不就是 `config/routes.rb`
开头的那句: `Blog::Application.routes.draw do … end` 嗯,是的, 正是它,
看来它是我们内部最关键的接口. 其关键代码如下:

    #去掉了处理异常与其他非关键操作
    mapper = Mapper.new(self)
    mapper.instance_exec(&block)

这里, 用到了 `instance_exec` , 根据这么久的元编程经验, 与 `yield self`
不同的是, 可以去掉 `|xx|` 的内容, 什么意思呢? 这也就是我们写 `routes.rb`
中的秘诀. 形如

    # 注意 match 前不需要加 self的block参数, 而 yield self则需要.
    Blog::Application.routes.draw do
      match '/post/new', :to=> 'post#new'
    end

但是, 注意是但是, 这种写法给了我们很大的帮助, 也就是说 block
中的方法都必须在 instance\_exec 调用的实例中定义, 那么,我们直接瞄准
`mapper.rb` 中的 `match`, `resources`, `put`, `get` 等等等等.
因为肯定要有. 好, 我们暂不动兵, 先继续往 `route_set.rb` 下看看, 一个
`url_for` 有些大,有些眼熟, 估计也就是我们常说的 `url_for`
底层路由生成方法, 还有一个 `recognize_path` 这个肯定是反向查找的.
除此之外,没啥内容了. 我们可以知道, `RouteSet` 确实是关键接口,
它向上(系统)提供 `add_route`, `recognize_path`, 向下(我们)提供
`routes.rb`的编写控制(不过不是自己亲手干,授权给下属 `mapper.rb` 了).
下一步, 参它一本: `mapper.rb`

#### mapper.rb 中的秘密花园

我们按照刚才的经验, 折叠一下模块代码, 就发现了秘密:

    module ActionDispatch
      module Routing
        class Mapper
          class Constraints
          class Mapping
          module Base
          module HttpHelpers
          moudle Scoping
          module Resources

          include Base
          include HttpHelpers
          include Redirection
          include Scoping
          include Resources
        end
      end
    end

可以看的出, 分工很明确, Mapper 是老大,其他模块作好定义后,交工给老大.
我们在此忽略 `Constraints`, `Scoping`, 因为它俩不是我们关注的目标.
我们直接看 `Base` 吧.

`module Base` 里有两个方法: `match`, `mount`. match,
有些意思的是,注释超长,但代码实现为零.人才…\
 我想是打一个桩在这里,留给接下来的模块实现,比如
`Rosources`中肯定会重定义. 我们来看看 `mount` 吧.显然,
它是用来挂载一个`rack`应用的, 我们且看如何实现:

找挂载点(:at) -\> 调用match -\> 定义前缀(:as) -\> over

看来,最终还是将重任交给了`match`, 是时候找到 mapper 的秘密了. 继续向下,
直接到 `Resources` 到 1284行:

    # 处理一堆参数
    paths.each { |_path| decomposed_match(_path, options.dup) }

又调用了 `decomposed_match` 我们往下看,

    def decomposed_match(path, options) # :nodoc:
      if on = options.delete(:on)
        send(on) { decomposed_match(path, options) }
      else
        case @scope[:scope_level]
        when :resources
          nested { decomposed_match(path, options) }
        when :resource
          member { decomposed_match(path, options) }
        else
          add_route(path, options)
        end
      end
    end

看的出, 它处理了 :on, :nested, member 的特殊情况, 我们暂时不看,
看到了真面目 `add_route`, 我们往下找,

    mapping = Mapping.new(@set, @scope, path, options)
    app, conditions, requirements, defaults, as, anchor = mapping.to_route
    @set.add_route(app, conditions, requirements, defaults, as, anchor)

处理了参数后, 重新回到了 `@set` 的怀里, 我擦…
至此,我们找到了最后的执行人,还记得刚才说到的 `太复杂的 Journey` 了吧.
我们再随便看看 `HttpHelpers`, 如我们预期, 定义了, `get`, `put` 等等,
其他模块还定义了 `resource` 与 `resources`, 全都像我们想的一样.

我们大胆猜测, `@set.add_route` 至少拥有 `dispatcher`(我们刚才分析到的),
`path`, `controller` 与`action`. 这类似于我们电脑中的路由.

我们还不太自信, 真如我们预期的那样么? 我们动态运行一下, 增加

    app, conditions, requirements, defaults, as, anchor = mapping.to_route
    puts "add_route: #{app}, #{conditions}, #{requirements}, #{defaults}, #{as}, #{anchor}"
    @set.add_route(app, conditions, requirements, defaults, as, anchor)

创建一个 rails 应用: `rails new route_test` , 并设定一个路由

    #edit config/routes.rb
    match '/path'=> 'project#index'

进入控制台就够了, `rails console`, 输出如下:

    add_route: #<ActionDispatch::Routing::RouteSet::Dispatcher:0x00000100c9d5a0>,{:path_info=>"/path(.:format)"}, {}, {:controller=>"project", :action=>"index"}, path, true

嗯, Very Well. 基本上按我们分析的在跑. 我们再初步总结下 `mapper.rb`
的作用, 负责 `config/routes.rb` 的解读, 将各条路由信息(各种各样的写法),
参数整理,分类,然后交给上级(RouteSet)添加路由, 上级将其转交给另一个模块
`Journey` 处理. 基本上整个流程清楚了, 不过我们还有好多工作没做呢. 例如,
`resources` 是怎么回事, `on`, `as`, `via`, `scope` 呢? 嵌套资源(nested
resource), 还有 rails3 直接支持的 `redirect`. 更关键的是,
我们还不知道如何查找路由,如何生成具名路由方法呢.

我们一步步来, 分析一下如何实现迷人的嵌套,而不需要过多的参数.

#### 嵌套, Scope 与 Namespcace 的生活

我们粗略看一下, 刚才被我们忽略的 `scope` 到处都是, 其关键调用,看上去就是
`with_scope_level`, 我们走,去看看 `mapper.rb:1393`:

          def with_scope_level(kind, resource = parent_resource)
            old, @scope[:scope_level] = @scope[:scope_level], kind
            old_resource, @scope[:scope_level_resource] = @scope[:scope_level_resource], resource
            yield
          ensure
            @scope[:scope_level] = old
            @scope[:scope_level_resource] = old_resource
          end

我们看的出, 典型的变种全局变量的使用, 即设定环境变量, `yield`, 恢复现场.
看样子,其关键技巧就在此了. 这里用到了 `@scope`, 我们去看看如何定义.
`mapper.rb:1502` 中

    @scope = { :path_names => @set.resources_path_names }

是一个 Hash, 没有更多信息了, 我们需要去看看 scope 了, 在
`mapper.rb:599`, 可以看到:

    def scope(*arg)
      #省略参数处理...
      recover[:block] = @scope[:blocks]
      @scope[:blocks] = merge_blocks_scope(@scope[:blocks], block)

      recover[:options] = @scope[:options]
      @scope[:options]  = merge_options_scope(@scope[:options], options)

      yield
      self
    ensure
      scope_options.each do |option|
        @scope[option] = recover[option] if recover.has_key?(option)
      end

      @scope[:options] = recover[:options]
      @scope[:blocks]  = recover[:block]
    end

Good, 看来 `@scope` 是保存现场的信息,用后再恢复,这样我们就明白了, 为什么
`namespace`, `scope`, `defaults`, `constraints` 是可以嵌套使用了.
如果你还有兴趣, 可以继续看它们的实现.

明白了这一层, 我们 `scope` 的分析就可以这样完工了, NeXT, 我们继续往下看
`resources` 吧.

#### Resources 们的懒惰

我们知道资源有复数与单数, 为了简单起见, 我们只分析一个吧, 拿 复数 说吧.
展开代码到 `mapper.rb:865`,

熟悉的 `actions` 们出现了, 记住了, 7个. 我们直接往下找
`def resources(*resources, &bock)`:

     def resources(*resources, &block)
       options = resources.extract_options!

       if apply_common_behavior_for(:resources, resources, options, &block)
         return self
       end

       resource_scope(:resources, Resource.new(resources.pop, options)) do
         yield if block_given?

         collection do
           get  :index if parent_resource.actions.include?(:index)
           post :create if parent_resource.actions.include?(:create)
         end

         new do
           get :new
         end if parent_resource.actions.include?(:new)

         member do
           get    :edit if parent_resource.actions.include?(:edit)
           get    :show if parent_resource.actions.include?(:show)
           put    :update if parent_resource.actions.include?(:update)
           delete :destroy if parent_resource.actions.include?(:destroy)
         end
       end

它们竟然直接使用了 `scope` 与 `match`, 好吧, 我们几乎已经完全明白了.
然而, 我们熟悉的具名路由哪去了? 是时候让它现身了.

#### 具名路由的真身

具名路由本质上是一系统 xx\_path, xx\_url 的方法, 我们估计它们被加载到
Controller::Base 和 Viewer::Base 中了, 我们来看看吧.

回到文件 `route_set.rb:92` 关于 `NamedRouteCollection` 的定义,
我们看到它加载了 `Enumerable`, 说明像一个遍历器, 你可以看成一个数组.
我们留意看到 `clear!` 里面有

    def clear!
      @routes = {}
      @helpers = []

      @module ||= Module.new do
        instance_methods.each { |selector| remove_method(selector) }
      end
    end

`@module` 看上去就是我们要找的定义了一系列的 xx\_path, xx\_url 了,
我们来往下继续看, 147行 `def install`,
这就是加载到其他有需求的类或模块中的接口吧, 贴一下:

    def install(destinations = [ActionController::Base, ActionView::Base], regenerate = false)
      reset! if regenerate
      Array(destinations).each do |dest|
        dest.__send__(:include, @module)
      end
    end

看缺省参数, 我们猜的十之八九, 除了重加载的调用外, 我们看到, 它 `include`
了 `@module` 我们继续看 `@module` 如何生成的:

    def define_named_route_methods(name, route)
      {:url => {:only_path => false}, :path => {:only_path => true}}.each do |kind, opts|
        hash = route.defaults.merge(:use_route => name).merge(opts)
        define_hash_access route, name, kind, hash
        define_url_helper route, name, kind, hash
      end
    end

到这里, 我们终于找出了真正生成方法的地方, 其关键调用即
`@module.module_eval do … end`, OK, 知道这个后, 我们回到 `RouteSet`里的
`add_route`, 谁在 `install` ?

在362行:

      def add_route(app, conditions = {}, requirements = {}, defaults = {}, name = nil, anchor = true)
        # 省略一些...
        # 这里生成具名路由, 注意, named_routes是刚才我们的 `NamedRoutes` 的实例, 它 `include` 了 `Enumerable`, 所以看上去像是数组.
        named_routes[name] = route if name
        route
      end

继续看, 我们会发现 `url_helpers` 这个方法调用了 `install`,
那么就是按需加载了. 到这里,我们正好引出了 `url_for.rb` 中的东西,
不过我不打算继续深入分析了, 因为它不过是具名路由的底层,
我花几小时就可以独立写出来. 总结下这里:

-   在底层方法 `add_route` 生成 `named_routes`, 注意是有 `name` 的时候,
    即 使用 `resources` 或 `resource` , 或者 `as`.
    嗯,应该就是这几个才会有. 你可以自行分析下.
-   当有调用 `url_helpers` 的时候, 自行 `install` 到 各 `base` 中,
    即我们在 `controller`, `viewer` 中要用到的.
-   必要的时候, `reset!` 与 重加载机制, 篇幅问题我不多说了,
    相信你可以轻松对付.

到此, 我们剩下了 **多态路由** 和 所谓的 **路由重定向** 了. 需要分析么,
不需要吧…

-   多态路由使得`url_for`更容易编写, 与我们关系不大.
-   重定向 `redirect_to` 一定是 `middleware` 的实现, 因为需要回应 301.
    值得说一点, 你可以直接在 `routes.rb` 定义如下重定向:

        match 'accounts/:name' => redirect(SubdomainRedirector.new('api'))

源码分析到这里就基本OK了, 我们来个回顾:

1.  `route_set` 是领导, 负责对外的接口, 对上层(系统)提供了
    `install_helpers`, 还提供了 `recognize_path` 用来识别并 `dispatch`
    路由, 但如何 `dispatch`, 本文未加分析.
2.  `route_set` 对下层(我们)提供了 `config/routes.rb`的编写规则, 交给
    `mapper.rb` 处理, `mapper.rb`很敬业地完成了相关工作,
    调用其最核心的方法 `match`, 当然, 中间还有一帮兄弟帮忙, 比如:
    `HttpHelpers`, `Scoping`, `Resources`.
3.  `route_set` 再次找到 `Namedroutes`, 帮助我们生了 `url_helpers`
    方法们. 以后 `Rails` 可以轻松地找到相关的路由信息了,
    再次我们不要忘了最苦逼的孩子: `Journey`, 它就是一外包工头,
    帮我们把最脏最累的活, 解析正则给解决了.

到此, `Dispatch` 可以放心做其他工作了, 研究研究中间件, `Dispatch`
就可以把控制权移交给我们请求了. 请求一来, 终于该我们的代码上场了.

那接下去, 我们是该继续分析传说中的 `引擎(Engine)` 的工作了,
我们顺带贴出它使用 `routes` 的代码:

engine中的使用接口 ( `railties-3.2.8/lib/rails/engine.rb:488` )

    def routes
      @routes ||= ActionDispatch::Routing::RouteSet.new
      @routes.append(&Proc.new) if block_given?
      @routes
    end 

整个路由系统是 `Rails` 的关键, 难度也相对较大, 但是, 顺着路子走,
我们还是较为清楚地理解了它的工作机制.当然,要想更明了各个参数处理,
你需要知道 `rails2` 到 `rails3` 的路由变化.

我故意忽略了 `testing`, Rails3 的代码越来越 Ruby 范了, 各种 `Sugar`
用的如鱼得水. 但其目标只有一个, 让代码更可读.

所以, 分离了 `Journey`, `Mapper` 采用 模块分离加载, `@module`
的创建与加载, 都不对原有代码有影响. 据此, Rails 的 路由机制分析到这里.

你学会如何构建聪明, 可定制化, 可测试性的 DSL 了么?

以下资源权当补充:

-   Rails3 与 Rails2 的 Route区别:

[http://www.engineyard.com/blog/2010/the-lowdown-on-routes-in-rails-3/](http://www.engineyard.com/blog/2010/the-lowdown-on-routes-in-rails-3/)

-   其他帮助:

[http://www.simonecarletti.com/blog/2009/09/inside-ruby-on-rails-reading-source-code/](http://www.simonecarletti.com/blog/2009/09/inside-ruby-on-rails-reading-source-code/)

-   Rails2 路由分析:

[http://woody-420420.iteye.com/blog/172796](http://woody-420420.iteye.com/blog/172796)

本文来自 [windy](http://yafeilee.me)\
 授权方式符合 署名 - 非商业 - 复制保留本授权
