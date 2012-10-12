---
layout: post
title: "关于 RVM 的问题"
date: 2012-09-28 15:56
comments: true
categories: rvm
tags: ['rvm','shell','ruby']
author: tassandar
---

# RVM  

RVM 的安装步骤和教程在网络上已经有很多教程了。但是自己在安装或者使用的时候还是遇上一些错误，把自己的解决方案拿出来分享，希望对大家有帮助。

### 1.RVM no found

这个最常见问题是需要在 .bash_rc 和 .bash_profile 文件中加入

    [[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm"

这样的一行语句。

这句话什么意思呢。分开来看 ，前面这部分由一个条件命令 [[ ]] 构成，返回一个 true 或者 false .

     [[ -s "$HOME/.rvm/scripts/rvm" ]]

就是 bash 通过 -s 命令去找对应的文件。如果存在，就返回 true ，否则 就返回 false。

如果返回true 那么就将继续执行  &&  符号链接后的语句
    
    . "$HOME/.rvm/scripts/rvm"

`.` 在bash中相当与source 命令的意思，你完全可以在这里把 . 用source命令来替换，这样就将 "$HOME/.rvm/scripts/rvm" 中的文件添加到了bash的环境中。

### 2.gnome-terminal 的 rvm is not a function

我们平时调用rvm的时候其实是调用了一个bash函数 rvm ，之后由这个函数来帮我们进行判断下一步工作。
rvm函数需要在用户登陆时进行注册才能使用。

但是ubuntu下，用户登陆是通过tty，ternimal是由 shell 生成的，而非login-shell。

因为这个问题，Ubuntu 用户下使用 terminal 常常就会遇到 “RVM is not a function” 的错误提示。

解决问题也很简单，把 terminal 设置成 login shell 就行了。

1. 打开一个 gnome-terminal.
2. 打开编辑，Profile属性，文件和命令
3. 点开 "Run Command as a login shell" 的选项.
4. 重新启动 gnome-terminal.

### 3.ssh 和 rvm 

不是你有没有过这样的经历。


ssh登陆机器并安装好了rvm，但是下次登陆之后莫名其妙的rvm 用不了了。提示 ‘command no found’。

或者说远程主机上 root 明明装上了 rvm， 但是不管用 su 切换成 root 用户还是使用 sudo 命令都无法找到 RVM 命令。

原因和上面的问题基本一样，原因就是 sudo  是一个 non-login shell 是无法触发 rvm 的函数脚本的。

这个问题的描述可以看这里 [rvm shell login](https://rvm.io/support/faq/#shell_login) 

至于 login shell 问题 和 究竟应该把 rvm 的启动脚本放哪里这个问题解释起来恐怕就比较费劲一些。

在 [这里](http://superuser.com/questions/183870/difference-between-bashrc-and-bash-profile/183980#183980) 有一份相当不错的关于 `.bash_rc`,`.bash_profile`的解释。

最简单的解决方案就是保证 `.bash_profile` 有那一句rvm的source语句之后，在正确的用户下运行

    bash --login

这样就能够使用 login shell 了。


当然还有其他方案。例如，把 rvm 函数的关联语句放到 /etc/.profile 文件中去。


或者直接使用 rvm 用户登陆。

### 4.rvm与启动项

这个问题通常是在安装 Thin 或者 Unicorn 的时候碰到的。

我们需要在 init.d 文件中写入 /usr/bin/unicorn_rails 这样的启动项。

但是由于你使用了rvm，那么可能对应的文件就非常难找了。

这时候可以用

    rvm wrapper ruby-1.9.3-p0@rails31 bootup unicorn_rails

这个命令来为 unicorn 创建一份快捷方式，默认会创建到 /usr/local/rvm/bin 或者 ~/.rvm/bin  下面。

### 参考资料

* [rvm basic](https://rvm.io/rvm/basics/)

* [Ruby China wiki:如何正确安装RVM](http://ruby-china.org/wiki/install_ruby_guide)

* [RVM 的一个问答](http://askubuntu.com/questions/40287/etc-profile-not-being-sourced)

* [一份unicorn的启动脚本](https://gist.github.com/1065357)


