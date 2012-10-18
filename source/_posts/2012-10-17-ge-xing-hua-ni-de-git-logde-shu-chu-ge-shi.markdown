---
layout: post
title: "个性化你的Git Log的输出格式"
date: 2012-10-17 22:01
comments: true
categories: Ruby-China
author: hisea
---
转载自[Ruby-China](http://ruby-china.org/topics/939)
广告：[http://hisea.me/p/git-log-output-formats](http://hisea.me/p/git-log-output-formats)

git已经变成了很多程序员日常工具之一。\
\
 git log是查看git历史的好工具，不过默认的格式并不是特别的直观。\
\
 很多时候想要更简便的输出更多或者更少的信息，这里列出几个git
log的format。\
\
 可以根据自己的需要定制。

git log命令可一接受一个--pretty选项，来确定输出的格式.\
\
 如果我们只想输出hash.

    git log --pretty=format:"%h" 

git用各种placeholder来决定各种显示内容： \
 下面内容来自[这里](http://linux.die.net/man/1/git-show)

-   %H: commit hash
-   %h: 缩短的commit hash
-   %T: tree hash
-   %t: 缩短的 tree hash
-   %P: parent hashes
-   %p: 缩短的 parent hashes
-   %an: 作者名字
-   %aN: mailmap的作者名字
    (.mailmap对应，详情参照[git-shortlog(1)](http://linux.die.net/man/1/git-shortlog)或者[git-blame(1)](http://linux.die.net/man/1/git-blame))\
-   %ae: 作者邮箱
-   %aE: 作者邮箱
    (.mailmap对应，详情参照[git-shortlog(1)](http://linux.die.net/man/1/git-shortlog)或者[git-blame(1)](http://linux.die.net/man/1/git-blame))
-   %ad: 日期 (--date= 制定的格式)
-   %aD: 日期, RFC2822格式
-   %ar: 日期, 相对格式(1 day ago)
-   %at: 日期, UNIX timestamp
-   %ai: 日期, ISO 8601 格式
-   %cn: 提交者名字
-   %cN: 提交者名字
    (.mailmap对应，详情参照[git-shortlog(1)](http://linux.die.net/man/1/git-shortlog)或者[git-blame(1)](http://linux.die.net/man/1/git-blame))
-   %ce: 提交者 email
-   %cE: 提交者 email
    (.mailmap对应，详情参照[git-shortlog(1)](http://linux.die.net/man/1/git-shortlog)或者[git-blame(1)](http://linux.die.net/man/1/git-blame))
-   %cd: 提交日期 (--date= 制定的格式)
-   %cD: 提交日期, RFC2822格式
-   %cr: 提交日期, 相对格式(1 day ago)
-   %ct: 提交日期, UNIX timestamp
-   %ci: 提交日期, ISO 8601 格式
-   %d: ref名称
-   %e: encoding
-   %s: commit信息标题
-   %f: sanitized subject line, suitable for a filename
-   %b: commit信息内容
-   %N: commit notes
-   %gD: reflog selector, e.g., refs/stash@{1}
-   %gd: shortened reflog selector, e.g., stash@{1}
-   %gs: reflog subject
-   %Cred: 切换到红色
-   %Cgreen: 切换到绿色
-   %Cblue: 切换到蓝色
-   %Creset: 重设颜色
-   %C(...): 制定颜色, as described in color.branch.\* config option
-   %m: left, right or boundary mark
-   %n: 换行
-   %%: a raw %
-   %x00: print a byte from a hex code
-   %w([[,[,]]]): switch line wrapping, like the -w option of
    git-shortlog(1).

除此之外， --graph选项可以显示branch的ascii图例。

如果你自己定制了一个喜欢的输出方案，可以保存到git
config，或者设置alias以便日后使用。\
\
 \~/.gitconfig中加入:

    [alias]
        lg = log --graph 

或者运行：

    git config --global alias.lg "log --graph"

最后来一个[别人分享](http://www.jukie.net/bart/blog/pimping-out-git-log)的例子，稍微有些慢，但是可以看下git
log定制效果，效果很酷。。

    git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)%Creset' --abbrev-commit --date=relative
