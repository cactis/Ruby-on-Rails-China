---
layout: post
title: "Rails.vim 高效使用指南"
date: 2012-10-18 11:42
comments: true
categories: RubyChina
author: lyfi2003
---
转载自[Ruby-China](http://ruby-china.org/topics/4478)
> 本文适用于vim的待进阶高手，这篇文章并不代表我是高手，只是切磋下互相学习下。如果你是刚听过vim，建议转身走人。\
>  rails.vim 是
> vim插件中极为强大的专门为Rails项目做开发的。熟悉运用后想必会远远超过所谓的IDE，不信？跟我试试。

开始之前，推荐进行实战，在本文最后有一个配置，相信你已经配置好了。

#### 跳转指令：

很明显，我们最常的需求就是在相关文件中跳来跳去，比如controller跳到view,
view跳到helper, 或者 unit test 中。\
 这个需求在rails.vim 很好的被满足了。

假定你在 `app/controllers/blogs_controller.rb`,见下表 ：

Rview index.html.erb -\> app/views/blogs/index.html.erb Rhelper -\>
app/helpers/blogs\_helper.rb

同理， Rcontroller, Rjavascript, Rstylesheet 这几个不用说了。\
 要是配合上 `ctrl + 6`
这个vim内置的跳回上一次编辑的文件（专业人士叫它缓冲区，我比较土，大家怎么容易理解怎么叫，如果`ctrl+6`不好用，估计被其他插件映射了，请参考最后的vim使用建议）\
 就很无敌了，一下子就超过netbeans, eclipse
之流好几个数量级的切换速度了。（它们得用鼠标。。。）

别急，还有更快的方法，Rview
这个玩意还要带个参，虽然可以用tab键补全，还是有点不极速。。。\
 我们来看看`gf`这个最出彩的命令。

将光标放在 `blogs_controller.rb` 的 `def index` 上， 按下 `gf` ， oh My
God, 自动跳到view的index\
 试试 `ctrl+6` 切回去吧。\
 别急，`gf`还有更多用：

下面 \< 是光标指向的区域后，按下gf跳转的方向( \*
是指光标位置，\<是将跳转的文件，强大吧。。。）\
 Pos\*t.first\
 \< app/models/post.rb \~

     has_many :c*omments

\< app/models/comment.rb \~

     link_to 'Home', :controller => 'bl*og'

\< app/controllers/blog\_controller.rb \~

     <%= render 'sh*ared/sidebar' %>

\< app/views/shared/\_sidebar.html.erb \~

     <%= stylesheet_link_tag 'scaf*fold' %>

\< public/stylesheets/scaffold.css \~

     class BlogController < Applica*tionController

\< app/controllers/application\_controller.rb \~

     class ApplicationController < ActionCont*roller::Base

\< .../action\_controller/base.rb \~

     fixtures :pos*ts

\< test/fixtures/posts.yml \~

     layout :pri*nt

\< app/views/layouts/print.html.erb \~

     <%= link_to "New", new_comme*nt_path %>

\< app/controllers/comments\_controller.rb (jumps to def new) \~

还有还有，虽然简化到极速了，但有时候还是要使用上面的Rxx系列跳转指令，还有更方便的吗，比如模糊查。。（source
Insight这货这个能力很强,知道吧）\
 当然也有，看：

Rfind 指令，你试下就会明白了，搜索controllers, views, unittest 或 spec
里面的文件进行匹配和跳转（注意必须首字母匹配然后是按tab找），这个偶尔会用用，不是太好用了啊。

A指令与R指令， 这两个小兄弟是很好用的了， 与
Rxx系列类似，A总是往unittest里面跳，R会跳相关的，比如在controller里，转到view中，这里有一个rails.vim自带帮助的跳转列表，看看就好了：

\* Current file Alternate file Related file\* model unit test schema
definition\* controller (in method) functional test template (view)\*
template (view) functional test controller (jump to method)\* migration
previous migration next migration\* config/database.yml config/routes.rb
config/environments/\*.rb

上面这些已经可以满足大部分需求了，哦，还有，我们经常要编辑`route.rb`，
有时候也会编辑 `config/*`里的东西怎么办？

Rails.vim也有一些可以满足，`route.rb`直接使用 `Rinitializer` 就可以了（常
用)。`Rinitializer 带参`就可以编辑 `config/initializer/xxx`的东西了。\
 还有一些，如 `Rlib`，`Rlayout`, `Rfunctionaltest`，`Renvironment` ，
不用记了，不常用的可以忘了,常用的用两次就记下了。

建议你除了`Rails.vim`，再安装一个`fuzzfinder.vim`这个插件，在vim中映射
`map <c-t> :FufCoverageFile!<CR>` \
 之后重启 vim 后使用 `ctrl+t` 打开一个模糊搜索框了，这下爽了吧。

到这，关于`rails.vim`跳转的就基本介绍完了。很简单，很易用，很强大。

#### 编辑或新建文件：

还有一类操作是直接找到要编辑的文件，或者新建一个文件。（我们可不想傻瓜似的重新开一个终端吧，这种影响效率的操作是作为Geek的我们无法接受的事情）\
 看招：\
`Redit`: 相对于Rails项目根目录进行编辑，如 Redit config/config.ru
。嗯，不错吧。\
 当然还有， `Rcd`
可以切换当前工作目录，这样方便Redit的连续操作，你以为Redit就这点用就错了，还有新建，试试这个：\
`Redit config/my_config.rb`:
嗯？新建了一个文件了，离开的时候Save就可以了。类似的，用`Redit`可以创建很多自定义文件。

还有一点补充，Rview这个指令，如果你在后面的参数带上了 .html.erb
，它会尝试帮你创建对应的空文件，很方便。(常 用）

不对不对，作者，我一般是自动运行 rails generate
生成的，你怎么告诉我这些玩意。。。

马上来，`Rgenerate` 指令对应于rails自带的生成命令，同理 `Rdestroy`
用来删除的。这个很常用，但与rails的对应，我不用多介绍了吧。

#### 操作指令：

`Rake`: 用来执行一些自带的rake命令的。

`Rgenerate migration xx` 用来生成指定的迁移文件

`Rake!`: 这种带！号可以将输出带回来，新开一个窗口，叫做 QuickFix

为什么这个地方的命令我放后面呢？我的建议是，如果是涉及独立的命令操作时，使用另一个终端处理，像我，使用
Guard+spork做单元测试，爽死了。 再开一个终端 thin start 或 rails s
这样足够。

小特性：\
 当然不用说,
rails.vim已经默认了很好看的语法高亮，你也可定制，这个不是本文的话题，你是DIY狂人的自己研究吧。\
 提供的一个 `ctrl + x + ctrl + u`（先按ctrl+x再按ctrl+u)
补全了许多许多rails内置的方法，如 `time_ago_in_words` 。
用好这个，老板再也不用担心我拼写E文错误的2B行为了。

小片断补全，嗯，有，快捷键是 ctrl+] 再加上要补全的内容，使用 Rabbr
可以看看，当前支持哪些。（这个功能有些2，不如再装一个snipmate
来玩，不过还算OK）

#### 其他:

还有 `Rextract` 这个玩意，可以帮你将view中冗余的代码转到partial里。\
 另外，还有一些整合的东西，如果你装了NERTree了，使用 Rtree
就可以打开树列表，有些用。（不过如果你足够高明的话，会使用 F8 来映射
打开树吧。嗯。你做了说明果然是Geek）；

最后，一般Rails开发，我总结一下使用 vim
时除了rails.vim还会用哪些插件，有兴趣你可以试试：

1.  **fuzzyfinder** 或者 command + T （推荐前者）
2.  **l9** 配合fuzzfinder用的。
3.  **zencoding.vim**
    这玩意好啊，用了它写html代码就像写这篇文字一样轻松。
4.  **NERD\_tree.vim**
    显示树的，一般人都需要吧，我虽然装了，但基本不装，除了review代码外。。。
5.  **NERD\_commenter.vim**
    这个可以用来快速注释代码或反注释代码。也推荐使用**tComment**
    来注释，更接近原生的vim操作。

再最后（我靠，你这作者，还有个再最后。。。），我想对vim的使用者说几点最佳实践：

#### 不要过多映射单键

什么 F10，F11 ，ctrl
+xx的都少一些。你最终会发现，多使用26个字母键，你的效益才是最好的。

#### 不要过多装插件，除非它符合你的风格。

插件都是在特定的领域里进行的改进，不要轻易安装任何一款你并不了解的插件。

#### 多使用 vim 默认的快捷键

实际上 `ctrl + x + ctrl +f`
就可以补全文件名。还有除了`i`进入插入模式外，你应该还知道，`a` 是向后插入，
`s`
是删除当前光标的字母并进入插入模式(如果你试了不好用，说明你的插件装过头了）。这个`s`也许就能帮你少打很多ESC，不是么？还有比如
`C` ， 删除当前行后面的字符，马上进入插入模式，这个也是很好用的。以及
`@5long` 留言中提到的 `S` 与 `cc` 删除当前行并插入。\
`m + 字母`，将当前行打一个标记，下次就可以直接使用 `' + 字母`(L后面的字符)
回到这里了。

#### 尽量少用tab而多用buffer

是的，你不需要多tab操作，bn 与 bp 足够你用了，不行的话还有`ls` 和 `b x`
。这个足够你的多文件编辑了。

符合vim的设计哲学，你的效率才是最高的。最最后，你可以参考一下我的vim配置（很简洁）：

[https://github.com/windy/ruby-vimrc](https://github.com/windy/ruby-vimrc)

推荐这几天看到的很适合分享vim知识的视频站：\
[http://happycasts.net/](http://happycasts.net/) 这里你可以学到不少技巧

如果你发现此文对你有用，对我有更多兴趣，欢迎访问和订阅我的博客：\
[http://yafeilee.me/](http://yafeilee.me/)

附：修复 `gf` 在 rails3.1以后view跳转public的bug：

    rails.vim gf跳转问题，fix:

     autoload/rails.vim:  1952：  将public改为 app/assets/stylesheets
    （下同）
    1958： app/assets/javascripts/\1'),'/defaults>','/application')
