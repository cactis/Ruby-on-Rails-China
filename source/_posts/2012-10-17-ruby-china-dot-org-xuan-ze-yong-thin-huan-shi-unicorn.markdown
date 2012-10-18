---
layout: post
title: "Ruby-China.org 选择用 Thin 还是 Unicorn?"
date: 2012-10-17 21:48
comments: true
categories: Ruby-China
author: lgn21st
---
转载自[Ruby-China](http://ruby-china.org/topics/35)
问题的起因是这样的：Ruby-China.org部署在一个Linode
512的Instance上，系统只有512M内存，跑一个Nginx带两个Thin的instance，外加MongoDB，Redis，还有一些后台任务等等。前几天
[*@*huacnlee](/huacnlee "@huacnlee")
跟我说内存不够用了，两个Thin和MongoDB一上去内存就捉襟见肘了，需要考虑升级VPS的内存了，否则极有可能随时把其他的Services如MongoDB或者Redis搞挂掉。\
![A73f2b074d7e848ade1bf9bce8987abe](http://l.ruby-china.org/photo/a73f2b074d7e848ade1bf9bce8987abe.png)

我当时建议用Unicorn试试看，Github和37Singles都全部迁移到了默认使用Unicorn作为Rails的server。昨天找了个时间测试了一下，开启2个Unicorn的worker\_processes，发现每个worker的内存占用跟Thin基本上一致，也就是说使用Unicorn并没有内存使用上的优势。\
![Cd1d5bdd4a4e2a71a7603f8a4bb207fd](http://l.ruby-china.org/photo/cd1d5bdd4a4e2a71a7603f8a4bb207fd.png)

我的理解是不管是thin，mongrel，webrick，还是unicorn，都需要载入一份完整的Rails
instance，Rails
instance的内存消耗是无法通过替换Server消减的。另外还有一个Memory
Bloat的问题，当Rails
server运行时间越长，占用的内存就越多，罪魁祸首是大量的ActiveRecord对象被hold在内存中，无法高效及时的释放掉，所以通常的作法是设定一个阈值，当Rails
Server使用内存超过一个具体的数值一段时间后，就Restart这个Rails
Server，这个方法在Production环境下已经被充分验证过是一个行之有效的解决方
案。

Unicorn的这种Master process + worker
processes的工作方式，在总体内存消耗上比Thin要略微大一点点，不过Unicorn相对于Thin的优势在于他的Load
balance机制是通过OS
Kernel来实现的，以及进程管理非常的Unix风格，有利于简化部署和系统管理:
[http://sirupsen.com/setting-up-unicorn-with-nginx/](http://sirupsen.com/setting-up-unicorn-with-nginx/)

    Load balancing between worker processes is done by the OS kernel. All workers share a common set of listener sockets and does non-blocking accept() on them. The kernel will decide which worker process to give a socket to and workers will sleep if there is nothing to accept().

Thin需要通过Nginx来做Load balancing，或者在多个Thin
instance前面架设一个HAproxy来实现高效的Load-balancing，不过就系统组成复杂度，部署难易程度，以及Load
balancing效能方面考虑，优选采用Unicorn的方案。

话说回来，我们仍然需尝试在其他地方压榨一些内存出来，或者考虑换回使用32bit的Linux？
