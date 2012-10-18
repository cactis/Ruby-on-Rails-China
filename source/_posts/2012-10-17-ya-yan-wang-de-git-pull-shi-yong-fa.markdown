---
layout: post
title: "鸭眼网的 git pull 使用法"
date: 2012-10-17 21:51
comments: true
categories: Ruby-China
author: lgn21st
---
转载自[Ruby-China](http://ruby-china.org/topics/306)
以前自己不讲究Git里面的branch之间应该怎么merge，但是受到这里这么多在代码上非常有追求的人的刺激，也开始关注如何才能提交干净整洁的git
commits，贴一份鸭眼网的 git pull 使用法在这里，然后自己收藏 XDXD

[https://github.com/yavaeye/yavaeye/wiki](https://github.com/yavaeye/yavaeye/wiki)

#### git pull 使用法

用 rebase 尽量减少多余的 merge commit

        git pull --rebase

pull 特定分支例

        git pull --rebase origin a-black-and-thick-branch

rebase 冲突了, 又不喜欢一步一步的 `git rebase` 怎么办?

        git rebase --abort
        git reset --hard HEAD
        git pull
        git status

#### git merge 使用法

保证清晰的路线图, 必须 no fast forward, 例如

        git merge --no-ff a-tiny-and-soft-branch
