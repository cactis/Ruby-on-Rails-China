---
layout: post
title: "Rails 中的自定义 Form Builder"
date: 2012-09-11 18:41
comments: true
categories: development 
tags: ['rails','form','custom']
author: tassandar
---

Rails 人性化的表单设计对于 web 开发人员来说一直是一个很棒的功能。但是上周因为一些小需求不得不再次认真研究了一下，有点心得，不敢独享。


## 从 Rails 的源码说起

我这里的 Rails 版本为 `3.2.8` ，关于表单的主要内容存在于 `Rails` 的 `ActionPack` 组件 `ActionView`下面。你可以在 `/PathToRails/actionpack-3.2.8/lib/action_view/helpers/form_helper.rb ` 中找到 Rails 中的 `Form Builder` 实现。

这个 Form Builder 基本结构是这样



{% sh [:ruby] %}
module ActionView
  module Helpers
      module FormHelper
        def form_for(record, options = {}, &proc)
          raise ArgumentError, "Missing block" unless block_given?

        options[:html] ||= {}

        case record
        when String, Symbol
          object_name = record
          object      = nil
        else
          object      = record.is_a?(Array) ? record.last : record
          object_name = options[:as] || ActiveModel::Naming.param_key(object)
          apply_form_for_options!(record, options)
        end

        options[:html][:remote] = options.delete(:remote) if options.has_key?(:remote)
        options[:html][:method] = options.delete(:method) if options.has_key?(:method)
        options[:html][:authenticity_token] = options.delete(:authenticity_token)

        builder = options[:parent_builder] = instantiate_builder(object_name, object, options, &proc)
        fields_for = fields_for(object_name, object, options, &proc)
        default_options = builder.multipart? ? { :multipart => true } : {}
        output = form_tag(options.delete(:url) || {}, default_options.merge!(options.delete(:html)))
        output << fields_for
        output.safe_concat('</form>')
        end

        def apply_form_for_options!(object_or_array, options) #:nodoc:
          #..... 
        end
        private :apply_form_for_options!
        
        def fields_for(    record_or_name_or_array, *args, &block)  end
        def label(         object_name, method, text = nil, options = {}) end
        def text_field(    object_name, method, options = {}) end
        def password_field(object_name, method, options = {}) end
        def hidden_field(  object_name, method, options = {}) end

        #....还有一些其他的标签。


        private

        def instantiate_builder(record_name, record_object, options, &block)
          #.....
          builder = options[:builder] || default_form_builder
          builder.new(object_name, object, self, options, block)
        end

        def default_form_builder
          #.....
        end

      end
  end
end
{% endsh %}


可以看到，当我们在 Action View 中调用 Rails 提供的 `form_for` 方法时，Rails 先是分辨和保存了一下我们传入的参数，对输出中依次传入了 `form_tag` 的返回内容和 `field_for`  的返回内容。


{%sh [:ruby] %}
builder = options[:parent_builder] = instantiate_builder(object_name, object, options, &proc)
fields_for = fields_for(object_name, object, options, &proc)
default_options = builder.multipart? ? { :multipart => true } : {}
output = form_tag(options.delete(:url) || {}, default_options.merge!(options.delete(:html)))
output << fields_for
output.safe_concat('</form>')
{% endsh %} 


前者 `form_tag` 就会输出标准的 HTML Form 标签。 

而后者 field_for 做的内容其实就是把form_for 函数带着的 block 给打开然后解析成 html 返回，基本实现如下

{%sh [:ruby] %}
def fields_for(record_name, record_object = nil, options = {}, &block)
    builder = instantiate_builder(record_name, record_object, options, &block)
    output = capture(builder, &block)
    output.concat builder.hidden_field(:id) if output && options[:hidden_field_id] && !builder.emitted_hidden_id?
    output
end
{% endsh %} 

这里的 `instantiate_builder` 函数会根据你是否传来 `builder`  参数做出选择，如果你这个参数是空的，他将会使用默认的 builder ：

{%sh [:ruby] %}
def default_form_builder
    builder = ActionView::Base.default_form_builder
    builder.respond_to?(:constantize) ? builder.constantize : builder
end
{% endsh %} 

这里看到了，我们平时使用的 form builer 其实就是 ActionView::Base.default_form_builder 的返回值。
这个值是什么呢,我们可以随手打开一个 rails 应用，开启 `rails console --sandbox` 做一个试验：


{%sh [:ruby] %}
Loading development environment (Rails 3.2.8)
1.9.3-p194 :001 > ActionView::Base.default_form_builder 
 => ActionView::Helpers::FormBuilder 
{% endsh %} 

原来这个默认的表单生成器就在眼前，我们来看一下 `FormBuilder` 的大概结构：


{%sh [:ruby] %}
class FormBuilder
      class_attribute :field_helpers
      self.field_helpers = FormHelper.instance_method_names - %w(form_for convert_to_model)

      attr_accessor :object_name, :object, :options

      attr_reader :multipart, :parent_builder
      alias :multipart? :multipart


      def initialize(object_name, object, template, options, proc)
        @nested_child_index = {}
        @object_name, @object, @template, @options, @proc = object_name, object, template, options, proc
        @parent_builder = options[:parent_builder]
        @default_options = @options ? @options.slice(:index, :namespace) : {}
        if @object_name.to_s.match(/\[\]$/)
          if object ||= @template.instance_variable_get("@#{Regexp.last_match.pre_match}") and object.respond_to?(:to_param)
            @auto_index = object.to_param
          else
            raise ArgumentError, "object[] naming but object param and @object var don't exist or don't respond to to_param: #{object.inspect}"
          end
        end
        @multipart = nil
      end
      # ....省略
      def label(method, text = nil, options = {}, &block)
        @template.label(@object_name, method, text, objectify_options(options), &block)
      end
      # 以下省略
end

{% endsh %} 

看得出来，在 builder  选中了这个默认form builder 之后，第一件事就是初始化
   
   def initialize(object_name, object, template, options, proc)

这里的参数大家可以回想自己使用 `form_for` 的时候的参数对照一下。

1.@object_name

对象名

2.@object

实例对象


3.@options

这里就是 `form_for` 传来的选型

4.@proc

`form_for` 传来的 block

5.@template

这个比较难理解，其实 @template 在这里是 Rails 的一个保留字，其实它就是一个 Rails 能够识别的视图对象 ，最典型的例子就是 `ActionView::Base` ,所以如果下次你见到有人给 FormBuilder 传了一个 __self__ 的参数，不要惊讶，他就是把当前处理的视图文件给传给了这个表单生成器。


然后 Rails 在这里为 @template 也就是视图对象定义了可能用上的函数：

{%sh [:ruby] %}
(field_helpers - %w(label check_box radio_button fields_for hidden_field file_field)).each do |selector|
        class_eval <<-RUBY_EVAL, __FILE__, __LINE__ + 1
          def #{selector}(method, options = {})  # def text_field(method, options = {})
            @template.send(                      #   @template.send(
              #{selector.inspect},               #     "text_field",
              @object_name,                      #     @object_name,
              method,                            #     method,
              objectify_options(options))        #     objectify_options(options))
          end                                    # end
        RUBY_EVAL
end
{% endsh %} 

最后它为自己定义了多个 FormHelper 的代理函数 ，这里举个例子，其他的都是一样的内容

{%sh [:ruby] %}
def label(method, text = nil, options = {}, &block)
        @template.label(@object_name, method, text, objectify_options(options), &block)
end
{% endsh %} 

也就是说，在 form_builder 遇到的这些函数，表单生成器一律交给 视图 对象去处理，例如在这里， Rails 让视图对象去执行 label 函数。

为什么 视图 对象能找到 FormHelper 中的函数呢。答案很简单，Rails 在我们平时在 View 中使用的 Helper 模块中混入了 FormHelper.


{%sh [:ruby] %}
module ActionView #:nodoc:
  module Helpers #:nodoc:
    extend ActiveSupport::Autoload
   
    #...
    autoload :FormHelper
    #...
    include FormHelper
    #...

  end
end
{% endsh %} 

这样也解释的通为什么我们可以直接在 View 中使用 form_for 函数了。

## 自定义表单

理论说完了，说点实用的。

### 自定义 FormBuilder

第一个常常会遇到的问题就是默认表单函数生成的东西和我们想要的不太一样。。。


例如当我们使用了 form 中的默认 label 函数：

    label(:post, :title)
    # => <label for="post_title">Title</label>

但是不巧的是前端大哥说了，我的label要是这样的


{%sh [:html] %}
    <dt>
    <label for="post_content" class="required">
      Content
    </label>
    </dt> 
{% endsh %}

懒惰的程序员当然不会为此妥协。我们需要一个自定义的表单和函数来满足需求。

我们先要在 helpers/custom_form_builder.rb 中做出一个新的 FormBuilder, 这个 FormBuilder 继承了Rails自带的表单生成器，并且我们要重写一个 label。

{%sh [:ruby] %}
class CustomFormBuilder < ActionView::Helpers::FormBuilder
  def label(label, *args)
    @template.content_tag("dt", super(label, *args))
  end
end
{% endsh %}



回忆起刚刚的 builder 参数了么。

现在我们只要在`form_for` 参数中加入一个 builder 参数就行了。

    <%= form_for @post, :builder => CustomFormBuilder do |form|%>
    ....

### 为FormBuilder添加函数

有的时候，你要为你的表单添加一些功能，由于是添加而不是覆盖，所以自己定义表单似乎不是十分必要（其实还是自己定义一个好），或者你希望能写出一个gem来对Rails的默认 FormBuilder 做出一些增强功能。这个时候你的需求是打开 FormBuilder 类，把自己的功能函数 Mix-in。

由于你已经看过了 Rails 表单部分的代码，所以这一需求对你也并不困难。

你需要让 Rails 能够载入并运行类似下面这样的代码，在你自己设置的 Rails 的autoload位置，或者干脆放到 `config/initializers/` 下面去。
这样你的 FormBuilder 就能够代理这些函数了。


{%sh [:ruby] %}
module CityHelper
  module FormBuilder
    def country_select(id, options = {}, html_options = {})
      @template.country_select @object_name, id, options, html_options
    end
    
     end
end
ActionView::Helpers::FormBuilder.send(:include, CityHelper::FormBuilder)
{%endsh %}

如果并不准备把自己的函数实现也注入 FormHelper 那么你就把自己的函数直接写到任意一个 Helper 文件里，让View实例能够调用，你就已经大工告成了。因为你就算打开 FormHelper 写入，最终也是要 included 到 Helper 模块下的。而且，把View中的增强功能写到 Helper 下面是一个不错的管理习惯，至少比放到 initializers 文件夹下要好找一点。


但是如果你并不满足于此，希望能够把这些功能做成一个 gem ，并且一定要打开Rails的默认表单类。


那么你就和Rails的定义方式一样，你需要做两件事：


1. 在 FormHelper 中实现你的函数


{%sh [:ruby] %}
module CityHelper
  module FormHelper
    def country_select(object, id, options = {}, html_options = {})
      self.country_select_tag "#{object}_#{id}", options.merge(html_options)
    end
    
    def country_select_tag(id, options)
          #...
    end

   end
end
ActionView::Helpers::FormHelper.send(:include, CityHelper::FormHelper)
{%endsh %}

2. 传入的@template定义这个函数。 


（回头一想觉得这种方法挺丑陋的，请教下有没有什么优雅的办法能够解决？）

参考阅读：

[advanced rails studio: custom form builder](http://onrails.org/2008/06/13/advanced-rails-studio-custom-form-builder)
[Form Builders in Rails](http://code.alexreisner.com/articles/form-builders-in-rails.html)
[Very Custom Form Builders in Rails](http://www.likeawritingdesk.com/posts/very-custom-form-builders-in-rails)
[Extending form for in Rails 3 with your own methods](http://blog.lrdesign.com/2011/04/extending-form_for-in-rails-3-with-your-own-methods/)
[Rails source code](https://github.com/rails/rails)
[Rails手册中文](http://guides.railschina.org/form_helpers.html)

