---
layout: post
title: "黑苹果完美安装，媲美 iMac, 省下来的钱可以去买大波罗了。"
date: 2012-10-17 22:56
comments: true
categories: Ruby-China
author: hhuai
---
转载自[Ruby-China](http://ruby-china.org/topics/3859)
原帖地址：（排出来的版要好看一点）\
[http://hhuai.github.com/blog/2012/06/17/blackapple-install/](http://hhuai.github.com/blog/2012/06/17/blackapple-install/)

实在忍受不了imac的大屏诱惑，昨天在我的游戏电脑上安装上Lion 10.7.3 + Xcode
4.3.3, 一路下来问题非常多，不过都一一解决了，记录一下。
希望可以帮到与我配置一样的朋友。

#### 惯例，有图有真相环节

![](http://l.ruby-china.org/photo/96e0bc2eaf78075ebd01bdfb12953abe.jpg)\
![](http://l.ruby-china.org/photo/ca00185a559ce2eeb152d9f983744d10.png)

#### 我的硬件配置

CPU 英特尔 Core i3-540 (双核)\
\
 主板 技嘉 H55M-S2V (英特尔 H55 (IbexPeak DH))\
\
 内存 4 GBytes\
\
 显卡 NVIDIA（英伟达） GeForce GT 240 (p672)\
\
 硬盘 WDC WD5000AAKX-001CA0\
\
 显示器 PHILIPS [未知 Model: PHLC081]\
\
 网卡 瑞昱 Semiconductor RTL8168/8111 PCI-E 千兆以太网 NIC\
\
 声卡 英特尔 5 Series/34x0 Chipset PCH - High Definition 音频设备 控制器
[B3]

#### 安装后效果

完美，要我用英文说是very good,perfect,wonderful.\
\
 水波效果可以开启，显示完美，可能我的显示器也还不错，是philips
22寸的，花了我一千大洋。\
\
 屏幕大，可以左边xcode,右边模拟器。\
\
 性能强劲，散热好（保持在50-60度），哎，去年专配来打山口山的。\
\
 还有些别人会出现的什么睡眠，关机问题一律没有。\
\

配这款机器时，电脑城的笑我怎么这么配，我说为了兼容mac系统。我也不懂他在笑啥，不过板子确实小点。

#### 安装教程

从零开始图文详解Win7下原版Lion制作懒人版和MacPE及安装过程\
[http://bbs.pcbeta.com/viewthread-979177-1-1.html](http://bbs.pcbeta.com/viewthread-979177-1-1.html)

这个教程写得非常详细，但是眼睛也能看花，佩服写教程的人，嗯，网上的好心人就是多。\
 说一下大概的过程：

1.  先制作一个类似于winpe的macpe,用于装系统或维护。
2.  分三个区，一个macpe, 一个安装盘，最后一个是你的系统，可以分大点。
3.  通过macpe来进行抹盘和灌系统。\

* * * * *

#### 以下为问题列表和解决方案

-   \#\#\#\#问题1：

按教程的流程，我在macpe启动时就进不去了，出现一个禁止的图标，机器就只能断电重启了。\
 程序员惯例，看日志。
在变色龙启动选盘时，加上-v命令，就可以看到详细的启动日志。\
 我这里出现的错误是一个 still waiting for root device,
然后一直卡这里time out.

**解决办法**

用google一搜，大量的说法和答案，主要都是由于硬盘模式引起的，需要bios中设置achi，我开始以为我肯定是设成了achi了，后来没办法了进bios中一看，默认设为ide了。改为achi后，问题解决。\
 （题外话，改为achi后，到windows中测了一下硬盘性能，还是木有变化。）

-   \#\#\#\#问题2：

接上面，这时流程就到了安装界面的语言选择，发现我的usb鼠标和键盘均失灵。

**解决办法**

又是google一通，情况很多，有人是串口鼠，usb键盘，驱动都不好选了。
解决方案是驱动删这个，换那个，忙乎了一阵，机器又是N多次重启，均无响应，真是烦啊。\
 先去做晚饭算了，减减压。\

晚饭后梳理一下情绪，加到一位好心人的qq,哎，你说这网上好心人这么多，现实中咋就看不到呢。\
 我罗罗索索问了很多，好心人回复了四个字，dsdt.
我就拿这个这个关键字，加上我的主板型号，\
 嘿，还真有的下载，下好后不管那么多，扔到Extra下的DSDT.aml,覆盖原文件。\
 重启后，搞定。

* * * * *

这时下一步下一步，基本上系统就装完了，这就完了，没。 只是可以开始了。

-   \#\#\#\#问题3：

显示器分辨率为1024\*768而且不能更改，想想我一个22寸的大屏上显示个这么小的尺寸是多么悲伤的事情。

**解决办法**

我搜啊搜，gt240中将版的驱动，试了好几个没解，突然有个帖子上有个好心人说直接改一下变色龙配置，lion可以接支接。在/Extra/org.chameleon.Boot.plist
中加入

    <key>GraphicsEnabler</key>
    <string>Yes</string>

重启，竟然可以了，清晰度不用再看了，比iMac还好。装上qq和五笔输入法，去pcbeta发个炫耀帖再说。

-   \#\#\#\#问题4

上不了网，网卡驱动不了。

**解决办法**

这个简单，到网上找个RealtekRTL81xx-0\_0\_90.pkg通用驱动，重启马上搞定。

-   \#\#\#\#问题5：

没有声音，前插后插都不行，音量图标为灰色。

**解决办法**

这个其实不影响我开发的小问题，花时间最多，前前后后估计重启十次以上。\

最后的解决办法，用最新的VoodooHDA-2.7.4.pkg，记住一定要这个，2.7.3不行，会导致系统启动不成功。\
 很完美，可以控制输出到前面的口还是后面的。\
 这里解决的重点是，搞清你的显卡到底是什么型号，我的这个是alc887,
用别的alc888之类的都不可以。\
 万一还是解决不了，我的建议是别折腾了，换usb声卡算鸟。

-   \#\#\#\#问题6

安装xcode, 用了下载好的硬盘版本dmg, 报错。\
 算了，开appstore慢慢拖吧，发现登陆报错，黑苹果的原因，苹果不认。

**解决办法**

网卡内置，在/Extra/org.chameleon.Boot.plist 中加入

    <key>EthernetBuiltIn</key>
    <string>Yes</string>

重启就行了，赶紧把我的xcode 4.3.3装起了。试用，一切正常。

好了，enjoy.
