---
layout: post
title: "在 OSX 上搞定 Rails，MySQL，RVM，Homebrew"
date: 2012-07-29 00:48
author: tassandar
comments: true
categories: development
tags: ['homebrew','rails','mac','osx','rvm']
---
这次入手了一个 Macbook Air ，系统是 OSX ，在安装 Ruby on Rails 环境的时候还是遇到了一些问题。做个记录。

参考了几篇文章，尽量写的详细一些，让本文能作为一份 Mac 上安装 Rails 的标准实践。

# Xcode

Xcode 在4.3以后的版本不再自带编译环境也就是 gcc 之类的。但是编译环境是必须的，这里你有这几个选择：

1. 把Xcode降级到4.2.
2. 安装Xcode，接着在打开Xcode，进入界面之后在 __属性__ 界面下的download里面加入_Command Line Tool_。如图。之后就有编译工具了。
![xcode commandline](http://www.railschina.org/images/xcode-screenshot.png)
3. 比较推荐的方法，Xcode 全套装备弄完要3个GB左右，如果你觉得IOS什么的和你没关系，你直接下载使用[osx-gcc-installer](https://github.com/kennethreitz/osx-gcc-installer)。这是一个纯净的OSX下的编译开发环境（270mb）。
<!--more--> 
# Homebrew

[Homebrew](mxcl.github.com/homebrew/) 是一个用 Ruby 语言写的 OSX 上的包管理程序，现在已经在开发者中几乎成为了标配。
安装很简单。运行
    /usr/bin/ruby -e "$(/usr/bin/curl -fsSL https://raw.github.com/mxcl/homebrew/master/Library/Contributions/install_homebrew.rb)"

就OK，如果你对这个脚本或者自定义安装感兴趣，看[这里](https://github.com/mxcl/homebrew/wiki/Installation).

在安装之后，运行一下
    brew doctor
检测下是否一切正常。有问题的话仔细看看问题提示然后谷歌。

另外，如果遇到了

> Error: No such file or directory - /usr/local/Cellar

这样的问题，新建一个文件夹：

    $ sudo mkdir /usr/local/Cellar

# Git 

[Git](http://git-scm.com/) 是当下非常火的版本控制软件， Homebrew 现在就可以派上用场:
    $ brew install git
Git 安装完成之后需要进行一系列的设置，例如 [Github](https//github.com) 的账号密码等等，具体看 [Git Set](https://help.github.com/articles/set-up-git) ,关于 Github 的设置可以参照 [Github Help](https://help.github.com/).

# RVM

[RVM](https://rvm.io) 是一个Ruby的版本管理器，有了它你就可以在各版本的 Ruby 中切换自如，另外 RVM 还有带了一些 Gem 管理的功能，具体的用法可以参照 [RVM 高级用法](http://ruby-china.org/wiki/rvm-guide).

安装 RVM 也是只要一行命令：
    curl https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer | bash -s stable
如果对安装还有问题可以看[这里](https://rvm.io/rvm/install/)
之后为你的命令行环境添加 RVM 命令。
bash的话就在 ~/.bashrc 中加入 
    [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"
zsh的话就在 ~/.zshrc 中加入
    [[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm" 
然后就可以安装最新的 Ruby 了：
    rvm install 1.9.3
另外提一个题外话，如果在gnome terminal 下(例如Ubuntu)出现了 ##RVM is not a function## 的问题，请参照 [这里](https://rvm.io/integration/gnome-terminal/).
如果在安装编译的时候有问题或者这篇 [问答](http://stackoverflow.com/questions/9651670/issue-updating-ruby-on-mac-with-xcode-4-3-1/9651747#9651747)能够对你有帮助。

# MySQL

你可以和我一样，你可以直接用 Homebrew 安装一些常用的开发软件：
    brew install git ack wget curl redis memcached libmemcached colordiff imagemagick nginx sqlite libxml2 libxslt readline v8 sphinx geoip lzo mysql
关于 MySQL 可以直接用 Homebrew 安装
    brew install mysql
安装之后需要设置一个用户才能使用
     mysql_install_db --verbose --user='root' --basedir="$(brew --prefix mysql)" --datadir=/usr/local/var/mysql --tmpdir=/tmp
如果你需要让 MySQL 能够开机启动，你可以做如下设置：
    $ mkdir -p ~/Library/LaunchAgents
    $ cp /usr/local/Cellar/mysql/5.5.14/com.mysql.mysqld.plist ~/Library/LaunchAgents/
    $ launchctl load -w ~/Library/LaunchAgents/com.mysql.mysqld.plist
这些信息你都可以通过
    homebrew info mysql
来获取。

# Rails
最后，Rails的安装和其他所有系统一样。

    gem install bundler rails

应该不会有什么错。
这里有一份更新非常及时的 [Rails安装指南](http://railsapps.github.com/installing-rails.html)

打完收工，检查下自己的成果
    rvm -v
    rvm 1.14.5 (master) by Wayne E. Seguin <wayneeseguin@gmail.com>, Michal Papis <mpapis@gmail.com> [https://rvm.io/]
    $ ruby -v
    ruby 1.9.3p194 (2012-04-20 revision 35410) [x86_64-darwin11.3.0]
    $ Rails -v
    Rails 3.2.6
    $ mysql --version
    mysql  Ver 14.14 Distrib 5.5.25a, for osx10.7 (i386) using readline 5.1
然后用
`$ brew doctor`
检查下包管理上有没有什么缺陷。按照提示修复就好了。

Ok,That's it~
现在可以带上你的全套装备继续开发了！

