---
layout: post
title: "選擇 oh-my-zsh 讓 Terminal 更好用"
date: 2012-10-17 21:56
comments: true
categories: Ruby-China
author: Victor
---
转载自[Ruby-China](http://ruby-china.org/topics/734)
項目地址
[https://github.com/robbyrussell/oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)

1 安裝\
 信春哥得永生，所以直接用作者提供得自動方式安裝

2 配置\
 命令行下面輸入 mate \~/.zshrc \

按照它的用戶手冊簡單修改一下，基本上以我人教英語初中版的英文水平是完全可以看懂的，相信你肯定不弱於我。貼一下我的

    # Path to your oh-my-zsh configuration. 一般默認就行
    ZSH=$HOME/.oh-my-zsh

    # Set name of the theme to load.
    # Look in ~/.oh-my-zsh/themes/
    # Optionally, if you set this to "random", it'll load a random theme each
    # time that oh-my-zsh is loaded. 
    # 選用的配色方案，我自己抄了一個
    export ZSH_THEME="victor"

    # Set to this to use case-sensitive completion
    # CASE_SENSITIVE="true"

    # Comment this out to disable weekly auto-update checks
    # DISABLE_AUTO_UPDATE="true"

    # Uncomment following line if you want to disable colors in ls
    # DISABLE_LS_COLORS="true"

    # Uncomment following line if you want to disable autosetting terminal title.
    # DISABLE_AUTO_TITLE="true"

    # Uncomment following line if you want disable red dots displayed while waiting for completion
    # DISABLE_COMPLETION_WAITING_DOTS="true"

    # Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
    # Example format: plugins=(rails git textmate ruby lighthouse)
    # 這裡選用你需要的插件
    plugins=(git node brew bundle cap gem github osx rails rails3 ruby rvm svn textmate)

    source $ZSH/oh-my-zsh.sh

    # 下面導入你的環境變量，注意不要跟 .bash_profile 衝突啦，不然怎麼死的都不知道
    # Customize to your needs...
    # export PATH=/usr/local/mysql/bin:/opt/local/bin:/opt/local/sbin:/Users/victor/.rvm/gems/ruby-1.8.7-p302/bin:/Users/victor/.rvm/gems/ruby-1.8.7-p302@global/bin:/Users/victor/.rvm/rubies/ruby-1.8.7-p302/bin:/Users/victor/.rvm/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/X11/bin

    # 下面是必須的嘍
    # http://episko.posterous.com/brew-zsh-git-and-rvm
    [[ -s $HOME/.rvm/scripts/rvm ]] && source $HOME/.rvm/scripts/rvm

3 自製 theme\
 先去
[https://wiki.github.com/robbyrussell/oh-my-zsh/themes](https://wiki.github.com/robbyrussell/oh-my-zsh/themes)
看看現存的theme\
 選幾個自己需要的功能，做到心中有數\
 回到命令行下面輸入 mate \~/.oh-my-zsh\
 在 themes 目錄下新建一個 victor.zsh-theme 好啦，現在需要什麼功能就開抄吧

    # Grab the current date (%D) and time (%T) wrapped in {}: {%D %T}
    DALLAS_CURRENT_TIME_="%{$fg[white]%}[%{$fg[yellow]%}%T%{$fg[white]%}]%{$reset_color%}"
    # Grab the current version of ruby in use (via RVM): [ruby-1.8.7]
    DALLAS_CURRENT_RUBY_="%{$fg[white]%}[%{$fg[magenta]%}\$(~/.rvm/bin/rvm-prompt i v g)%{$fg[white]%}]%{$reset_color%}"
    # Grab the current machine name: muscato
    DALLAS_CURRENT_MACH_="%{$fg[green]%}%m%{$fg[white]%}:%{$reset_color%}"
    # Grab the current filepath, use shortcuts: ~/Desktop
    # Append the current git branch, if in a git repository: ~aw@master
    DALLAS_CURRENT_LOCA_="%{$fg[cyan]%}%~\$(git_prompt_info)%{$reset_color%}"
    # Grab the current username: dallas
    DALLAS_CURRENT_USER_="%{$fg[red]%}%n%{$fg[white]%}:%{$reset_color%}"
    # Use a % for normal users and a # for privelaged (root) users.
    DALLAS_PROMPT_CHAR_="%{$fg[white]%}%(!.#.%%)%{$reset_color%}"
    # For the git prompt, use a white @ and blue text for the branch name
    ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg[white]%}@%{$fg[blue]%}"
    # Close it all off by resetting the color and styles.
    ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%}"
    # Do nothing if the branch is clean (no changes).
    ZSH_THEME_GIT_PROMPT_CLEAN=""
    # Add 3 cyan ✗s if this branch is diiirrrty! Dirty branch!
    ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[cyan]%}✗✗✗"

    # Put it all together!
    PROMPT="$DALLAS_CURRENT_TIME_$DALLAS_CURRENT_RUBY_$DALLAS_CURRENT_USER_$DALLAS_CURRENT_LOCA_ $DALLAS_PROMPT_CHAR_ "

回到命令行新開一個窗口，效果如下，顯示了當前rvm的ruby和gemset版本，並且顯示了當前目錄和用戶，對我來說足夠用了

    [23:49][ruby-1.9.2@rails3x]victor:~/Work/Source %
