---
layout: post
title: "使用 Vim 开发 Ruby on Rails（2012-03-19版）"
date: 2012-10-17 22:27
comments: true
categories: Ruby-China
author: ruchee
---
转载自[Ruby-China](http://ruby-china.org/topics/2047)
响应 [*@*zw963](/zw963 "@zw963") 主席的号召，本帖传教Vim，愿造福Vim新人

原是为Q群群友而作，现公之于众

完整配置下载地址：[http://www.ruchee.com/download/Gvim\_Ruby\_2012-03-19.7z](http://www.ruchee.com/download/Gvim_Ruby_2012-03-19.7z)

* * * * *

本版本为Ruby专用，兼顾C/C++和其他语种，适用于Windows环境下的Gvim

[**如想用于Linux环境，只需修改部分语句，请社区咨询**]

主要特色：

1.  使用Ruby专用的字体和着色模式
2.  集成了**snipMate**插件，支持Tab键补全，对Ruby和erb模板文件支持良好
3.  集成了**ZenCoding**插件，方便编写HTML和CSS
4.  集成了**Rails.vim**，便于在Vim中进行RoR开发
5.  支持单源文件一键编译和运行
6.  支持括号自动匹配和补全
7.  支持一键加载语法模板
8.  其他常用按键请查看\_vimrc最前面的注释说明

* * * * *

如果你是Vim已经入门的用户，使用方法自不待我多言

如果你是徘徊于Vim门外的爱好者，请按说明依次执行下述操作

* * * * *

1.  访问[http://www.vim.org/download.php\#pc](http://www.vim.org/download.php#pc)下载最新的
    Gvim
2.  安装Gvim到任意目录，这儿为方便讲解，我假定你安装到了D:\\Apps\\Gvim
3.  将D:\\Apps\\Gvim\\vim73目录加入环境变量
    [不知何为环境变量者，请Google]
4.  删除Gvim安装目录下的vimfiles目录
5.  复制提供的vimfiles目录到D:\\Apps\\Gvim下，取代已删目录的位置
6.  将提供的小工具软件全部复制到D:\\Apps\\Gvim\\vim73目录下
7.  复制提供的\_vimrc到D:\\Apps\\Gvim进行替换
8.  复制MONACO.TTF到C:\\WINDOWS\\Fonts目录下进行字体的安装
9.  使用任意文本编辑器打开\_vimrc，将名字、邮箱、网址等全部替换为你自己的信息，如遇路径不同也全部替换为你本机的实际路径
10. 然后。。。然后就大功告成了，接下只需学习如何使用而已，使用说明全部集中在\_vimrc文件的头部

* * * * *

**教程资料文件夹提供有部分学习资料**，可作参考

Gvim的完整配置版本请关注：[http://www.oschina.net/code/snippet\_103341\_8984](http://www.oschina.net/code/snippet_103341_8984)

* * * * *

-   Zen
    Coding使用说明：[http://www.ruchee.com/code/linux/vim/zencoding.html](http://www.ruchee.com/code/linux/vim/zencoding.html)
-   snipMate使用说明：请自行查看vimfiles/snippets目录下的ruby.snippets和eruby.snippets
-   Rails.vim的使用请自行Google [因为我本人几乎不用]
-   凡使用上有疑问，请社区咨询求解\
