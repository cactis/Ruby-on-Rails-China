---
layout: post
title: "Passenger/Nginx/Ubuntu快速部署Rails 3.1"
date: 2012-10-17 21:56
comments: true
categories: Ruby-China
author: hisea
---
转载自[Ruby-China](http://ruby-china.org/topics/701)
重新配了一个服务器，分享一下部署过程。\
 很多东西都不是从源码安装，寻求最短的部署时间。

原文地址：
[http://hisea.me/p/rails31-ubuntu-passenger-nginx-quick-deploy](http://hisea.me/p/rails31-ubuntu-passenger-nginx-quick-deploy)

#### 安装所需的linux包

    sudo apt-get install build-essential bison openssl libreadline6 libreadline6-dev curl git-core zlib1g zlib1g-dev libssl-dev libyaml-dev  libxml2-dev libxslt-dev autoconf libc6-dev zlib1g-dev libssl-dev build-essential curl git-core libc6-dev g++ gcc

#### 添加一个rails用户

    sudo adduser railsu
    sudo usermod -G passenger,www-data,sudo railsu
    su - railsu

#### 安装 rvm

    bash < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)

加载rvm (只需第一次安装时加载)

    source .bashrc

安装ruby

    rvm install 1.9.2

rvm 高阶应用可以参考[这里的指南](http://hisea.me/p/rvm-guide)

#### 安装 passenger/nginx

    rvm use 1.9.2 default
    gem install passenger
    rvmsudo passenger-install-nginx-module

所有都选默认，包括nginx安装目录业选择默认 /opt/nginx/

#### 安装nginx启动脚本

    wget https://raw.github.com/gist/1548664/53f6d7ccb9dfc82a50c95e9f6e2e60dc59e4c2fb/nginx

    sudo cp nginx /etc/init.d/
    sudo chmod +x /etc/init.d/nginx
    sudo update-rc.d nginx defaults

#### 配置nginx

配置文件在 /opt/nginx/config/nginx.conf

    server {
       listen 80;
       server_name www.yourhost.com;
       root /home/railsu/project/public;   # <--- 这里是你项目的public目录
       passenger_enabled on;
    }

#### 搞定你的数据库

-   如果是MongoDB，
    可以参考[这里的部署方案](http://hisea.me/p/mongodb-production-deployment-on-ubuntu)

#### 安装node.js

用来precompile rails assets

    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs

#### precompile assets

    cd ~/project
    rake assets:precompile

#### 启动

    sudo /etc/init.d/nginx start
