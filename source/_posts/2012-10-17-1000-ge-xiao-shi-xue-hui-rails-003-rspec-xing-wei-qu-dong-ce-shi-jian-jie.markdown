---
layout: post
title: "1000 个小时学会 Rails - 003 RSpec 行为驱动测试简介"
date: 2012-10-17 22:40
comments: true
categories: Ruby-China
author: Juanito
---
转载自[Ruby-China](http://ruby-china.org/topics/2848)
**1000 个小时学会 Rails 系列**

上一回: [002 测试！测试！](http://ruby-china.org/topics/2832)

**下文某些代码缩排是四格，调老半天都不行，请注意，Ruby 代码缩排是 2 格**

#### 003 RSpec 行为驱动测试简介

> 关关雎鸠，在河之洲。\
>  窈窕淑女，君子好逑。

今天要介绍的是 RSpec 这个 Gem。

这个 Gem 是干啥用的呢，RSpec 是一个 BDD 测试工具，用起来跟 TDD
工具差不多，只是包了一层 DSL
外衣，也就是说语法比较接近咱人类在用的语言（据说这样开发者与客户可以直接沟通了？）；还有一个
Gem 叫做 Capybara，这个贼难念的单词是
Capybara，水豚，发音可以来[这里](http://goo.gl/mqpiQ)听看看，声音没有
[Rails 视频教程](http://railscasts-china.com/)的 Terry
老师([*@*poshboytl](/poshboytl "@poshboytl"))那么性感就是了。Capybara
是一个整合测试 Rack
应用的工具，可以模拟真实用户使用你的网站的行为。Capybara 跟 RSpec
起来非常好用！

但今天先介绍 RSpec。。。

接下来要讲的例子呢，你不需要有 Rails 的环境，只需要有 Ruby 与 RubyGems
即可。

Let's Dive in!!!

RSpec 的测试是用 Ruby
[DSL](http://en.wikipedia.org/wiki/Domain-specific_language)
写成的，看起来像是这样子：

    describe Programmer do
      it "is lonely" do
        Programmer.lonely?.should be_true
      end
    end

程序员寂寞么？恩。。。。。。这语法看起来跟英语差不多吧 :
）这样写的好处是比较 Geek 一点的客户也能在[验收测试(Acceptance
Testing)](http://en.wikipedia.org/wiki/Acceptance_testing)的阶段直接跟你讨论，看看上帝的要求有没有都满足了！我们这儿有句话说客户是上帝，不知道你们那。。。圣经有一段：上帝说有光，就有光，客户说这个，就这个。。。而这对一个开发人员呢有什么好处呢？可以看看，嗯，这个功能具体是要做什么，然后去实现它。另外一个用
DSL
写的好处是，客户、开发者、代码，都可以用这种近似英语的语言交流（理想、理想嘛）。

而实际上 RSpec 是扩展一些 `Test::Unit`
已经提供的方法。你喜欢的话，也可以在 RSpec
的测试里混著用。好，下面我们会用另外一个例子，讲讲怎么用这个 RSpec。。。

关关雎鸠，在河之洲，窈窕淑女，君子好逑。。。

#### 安装 RSpec

一如往常的一键安装 `gem install rspec` （目前是 2.9.0 ＠20120423)

会顺便安装相依的 Gem：

    Fetching: rspec-core-2.9.0.gem (100%)
    Fetching: diff-lcs-1.1.3.gem (100%)
    Fetching: rspec-expectations-2.9.1.gem (100%)
    Fetching: rspec-mocks-2.9.0.gem (100%)
    Fetching: rspec-2.9.0.gem (100%)

最后一行你可以看到我们安了 `rspec-2.9.0.gem` ，而这些相依的 Gem
是要装的，就像水和鱼，过儿与龙儿，我和苍老师，是离不开彼此的。

#### 一个简单例子

很好，很好，Gem 装好以后呢，让我们添加一个新的目录叫做 `girl`
，爱存哪就存哪，而下面再添加一个 `spec` 目录：

一键完成： `mkdir -p girl/spec`

在 `spec` 目录下建立一个文件叫做 `girl_spec.rb` ，注意到这个 `_spec`
了吗，这样一看就知道是一个 RSpec
的测试文件，有木有！！！！！用你喜欢的编辑器打开 `girl_spec.rb`
并敲入以下代码：

    describe Girl do
        it "has chance?" do
            Girl.chance?.should be_true
        end
    end

好了，相信各位都看的懂这个例子，我们描述了一个女孩，有机会吗？应该有吧！让我们在更深入的理解以上这位女孩之前，不是，是深入理解这段代码。。。首先
`describe` 区块 (block) 包含了一个描述这个女孩的测试
(`it`)，而你宣称你应该有机会
(`Girl.chance?.should be_true`)。这跟断言有点像
(`assert`)。而如果其结果不如预期的话，RSpec 会报错并停止这个测试 (spec)。

那这个 `should` 哪来的，它还有一个兄弟 `should_not`，呵呵，RSpec
帮你定义好的。

> When RSpec executes specifications, \
>  it defines \#should and \#should\_not \
>  on every object in the system. \
>  These methods are your entry to the magic of RSpec.\
>  -- [RSpec.info](http://rspec.info/)

现在让我们运行看看，将终端切换到 `girl` 目录下：`[your-path-to/girl] $`
，接著输入：

`rspec spec`

究竟你跟她有没有机会呢。。。登登登。。。

神马！？

    uninitialized constant Girl (NameError)

你根本就不知道这女孩是谁，就想追人家了，好小子你，接下来让我们定义一下这个
Girl 常量（类）。要定义她的话，得先添加另外一个目录，叫做 `lib`
，为什么呢？因为女孩都喜欢住在房子里 (live in
building，无恶意。。。)，不是，因为之后 RSpec
会替你识别这个目录，帮你引用进来。。。

在这个目录里添加一个 `girl.rb`，并填入：

    class Girl

    end

好了，再来我们还得回头告诉 RSpec 咱要追的是哪个女孩，回到 `girl_spec.rb`
，添加：`require girl` 呵呵，大家都需要。。。当你再次运行这个测试
`rspec spec` ，因为你告诉了 RSpec 要载入这个 `girl` ，RSpec 会把 `lib`
目录添加到与 `spec` 同一层，这就是为什么你可以找到 `lib/girl.rb`
的原因，但是唉妈呀！又出错了：

    F

    Failures:

      1) Girl has chance?
         Failure/Error: Girl.chance?.should be_true
         NoMethodError:
           undefined method `chance?' for Girl:Class
         # ./spec/girl_spec.rbin `block (2 levels) in <top (required)>'

    Finished in 0.00056 seconds
    1 example, 1 failure

    Failed examples:

真是完整的错误信息阿！`F` 告诉我们失败了，就像你在 `Test::Unit`
里看到的一样，而下面它告诉你详细的错误信息，让你可以即时改正，所以说呢，女生找老公，找程序员是最靠谱的了，每天都拼命找哪里犯了错，并且马上改！心动不如马上行动，有兴趣的姑娘立即发短信至
[13910733521](http://v.youku.com/v_show/id_XMjQzNTkzMDM2.html)，童叟无欺。

回头看这到底哪儿错了：

    NoMethodError:
        undefined method `chance?' for Girl:Class

哦，原来我们还没研究出，我们和一个女孩到底有没有戏的方法，让我们现在来定义一个：

    class Girl
        def self.chance?
            true
        end
    end

这里我们用了 `self.chance?`
，在类的级别定义。意思是说呢，只要是女孩这个类的，都有戏！如果你没有加这个
`self` 的话，那就得是属于女孩这个类产生的实体才有戏了。现在我们在运行看看
`rspec spec` ：

    .

    Finished in 0.00367 seconds
    1 example, 0 failures

和 `Test::Unit`
一样，用一个极富深意的点，告诉我们测试通过！太棒了！这是我们写的第一个 RSpec
测试，欢呼！

好，假设今天，你不想要每个是女孩类别的都有戏，这样子太困扰了，每天都被骚扰。你只想要女孩类别所产生的实体有戏就好了。让我们看看怎么做，首先呢，你打开
`lib/girl.rb` ，并把 `self` 拿掉：

    class Girl
        def chance?
            true
        end
    end

并且相应的改动你的 spec：

    require 'girl'

    describe Girl do
      it "has chance?" do
        Girl.new.chance?.should be_true
      end
    end

运行： `rspec spec` ，呼，终于摆脱了一卡车的女孩了，呵呵！

现在让我们再来往这个测试添点东西，加入一个 `taken!`
方法，被把走了，也就是说这个女孩没戏了。这个方法呢，在 `Girl`
对象上创了一个实体变量叫做 `@taken`，而你将使用 `chance?` 方法来检验。

首先呢，你得先在测试里，测试这个 `taken!`
方法，是否是做你想要做的事儿。让我们在 `spec/girl_spec.rb`
里面再添一个例子：

    require 'girl'

    describe Girl do
      it "has chance?" do
        Girl.new.chance?.should be_true
      end

      it "taken!" do
        girl = Girl.new
        girl.taken!
        girl.should be_chance
      end
    end

再我们测试之前，发现到了没有，有木有？你 YRY 了，You Repeat Yourself!
你可以看到我们定义了一个 `Girl.new` 然后第一个例子里又使用了 `Girl.new`
，而我们是果断支持 DRY 的，所以...

嗯嗯，让我们思索一下如何整理代码，1, 2, 3 秒，OK! 让我们把 `Girl.new`
放到一个 `subject` 区块。 `subject` 允许你在所有位于 `describe`
区块内的测试里建立一个对象的索引。你可以这样定义一个 `subject` ：

    subject { Girl.new }

而现在我们的测试文件：

    require 'girl'

    describe Girl do

        subject { Girl.new }

      it "has chance?" do
        Girl.new.chance?.should be_true
      end

      it "taken!" do
        girl = Girl.new
        girl.taken!
        girl.should be_chance
      end
    end

你在这个测试的语境中，宣告了一个 `subject`
，然后我们来改写一下，比如第一个测试，有没有戏呢，你现在可以这样子替换：

    its(:chance?) { should be_true }

这个 `its` 方法，接受一个方法的名字来调用这个 `subject` (Ruby 继承自
smalltalk，调用方法其实都是给对象发信息) 。然而后方这个 `{ ... }`
区块应该要包含一个预测这个方法调用完的结果。

然而我们还可以这样调用：

    it "taken!" do
      subject.taken!
      subject.should_not be_chance
    end

而这里 `taken!` 方法必须使用 `subject` 来调用，因为我们只在 `Girl`
类别里有定义她。在这个情况，你没有使用 `its` ，因为你想要调用 `taken!`
方法，并且确认这个方法是否改变了 `chance?` 方法所返回的结果。

呼，意思就是女孩被追走了，还有没有戏啊？

而为了让我们的代码的可读性更猛一点，我使用了 `should_not` 来判断
`be_chance` 。

现在你的 `girl_spec.rb` 看起来是：

    require 'girl'

    describe Girl do

      subject { Girl.new }

      its(:chance?) { should be_true }

      it "taken!" do
        subject.taken!
        subject.should_not be_chance
      end
    end

好了，让我们运行看看，土地公公老爷爷阿，究竟女孩与我。。。

    NoMethodError:
      undefined method `taken!' for #<Girl:0x0000010087bcb0>

搞半天我根本还没定义 `taken!` 方法啊，失败！立马定义一个，打开
`lib/girl.rb` ：

    def taken!
        self.taken = be_true
    end

OK，再运行一次：

    NoMethodError:
        undefined method `taken=' for #<Girl:0x0000010087f838>

呜呜，咋回事儿呢？

原来我用了 `self.taken = true` ，Ruby 在跟我抱怨找不到这个 `taken=`
方法。我们可以使用 Ruby 提供的 `attr_accessor` 方法来定义这些琐碎的
`getter/setter` : ） 添加这行代码至 `lib/girl.rb` 最上方：

    attr_accessor :taken

这里 `attr` 是 attribute 的缩写，学 Ruby
还学英语呢，真好！当你把一个符号（符号是一个冒号带名字 `:xxx`）传给这个
`attr_accessor` 方法时，它替你定义了把 `taken`
设定与取出值的方法。它也替你定义了一个实体变量叫做 `@taken`
给每一个这个类别的对象设值时使用。

好的，咱的女孩儿现在看起来像是这样：

    class Girl

        attr_accessor :taken

        def chance?
            true
        end

        def taken!
            self.taken = true
        end

    end

再运行一次 `rspec spec`，月老公公老奶奶阿，看你的了阿：

    expected chance? to return false, got true

唔？预期没戏，返回的结果是有戏，怎么会这样呢？哎呀，因为 `chance?`
永远都返回真嘛，我们应该要判断这个女孩是否被把走了，然后再下手。。。嗯嗯嗯：

    def chance?
        !taken
    end

运行 `rspec spec` !

    ..

    Finished in 0.00917 seconds
    2 examples, 0 failures

阿哈，终于成功了！！！！！！！！

但是，要是我们粗心大意，不小心忘了加 `self` 前缀呢？现在让我们把
`self.taken` 的 `self` 拿掉看看。。。

    1) Girl taken!
       Failure/Error: subject.should_not be_chance
         expected chance? to return false, got true

RSpec 告诉我们：

    1) 女孩被把了！
        失败/错误：subject.should_not be_chance
        预期没戏，却有戏。

这样还不用 RSpec 么？太牛了！哈哈哈哈。。。

好啦，RSpec
可以避免我们犯这种明显的错误，若犯错，即改之。如果你先写测试，然后让你的代码通过测试，你就会有很强大的自信，你的代码是工作的！而之后重构时，也可以一点一点的重构，在跑的过测试的前提之下。

好的，我们把它改回正确的吧：

    def taken!
        self.taken = true
    end

运行成功。。。

OK! 现在你对 RSpec
有了基础的认识，之后当你想要这样子开发你的应用时，当然不是我这样子轻浮的方式，是用行为驱动开发方式来开发应用时，你将会需要看看这本书：[The
RSpec Book](http://pragprog.com/book/achbd/the-rspec-book)。

最后，路上把妹的时候要注意阿各位，记得先测试一下。

距离学会 Rails 还有 960 个小时。。

待续。。。

延伸阅读：

[The RSpec Book](http://pragprog.com/book/achbd/the-rspec-book)

[RSpec 让你愛上写测试](http://www.slideshare.net/ihower/rspec-7394497)

[RSpec Best practices and
tips](http://jhjguxin.sinaapp.com/2012/02/26/rspec-best-practices-and-tips/)

[CSDN一篇不错的
对测试的认识](http://blog.csdn.net/onlyqi/article/details/6740930)

[RSpec 简明指南](http://www.letrails.cn/archives/20/)

[RSpec on Rails PDF](http://vdisk.weibo.com/s/4vJBP)

[低成本泡妞](http://bookapp.book.qq.com/origin/book/?workid=1956140)

下一回：[004 神秘的 X 项目](http://ruby-china.org/topics/3239)
