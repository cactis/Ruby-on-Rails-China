---
layout: post
title: "postgresql permission denied error"
date: 2012-10-21 21:47
comments: true
categories: rails
author: tassandar
tags: PostgreSQL
---

今天在自己的 Mac 下在自己的新项目中使用了PostgreSQL, brew 安装启动数据库之后出现 `could not connet to server: Permission denied` 并且告知"/var/pgsql_socket/.s.PGSQL.5432" 不存在的错误。

多次谷歌之后终于找到答案

原因是 MacOS 默认安装了一个 PostgreSQL ，所以当你再开一个 brew 下的PostgreSQL 的时候，默认的 PostgreSQL 就会率先跳出来并报错（未启动）。

解决方案有几种：

1. 运行脚本 `curl http://nextmarvel.net/blog/downloads/fixBrewLionPostgres.sh | sh`

解决方案来自[这里](http://nextmarvel.net/blog/2011/09/brew-install-postgresql-on-os-x-lion/)，大家可以在这里看到脚本的内容。

2. 比较好用的方法，打开 `$HOME/.bash_profile`, 编辑其中 PATH=/usr/local/bin:$PATH   即把brew的目录调换到有限位置即可。

3. 搜索到socket文件，然后把 文件做一个链接

sudo find / '.s.PGSQL.5432'
=>  /tmp/.s/PGSQL.5432

ln -s /tmp/.s/PGSQL.5432 /var/pgsql_socket/

搞定。
