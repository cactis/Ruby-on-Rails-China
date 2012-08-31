---
layout: post
title: "Unicorn使用简介"
date: 2012-08-09 18:03
comments: true
categories: deploy
tags: ['部署','Unicorn']
author: lxneng 
---

原文转自 [ruby-china](http://ruby-china.org/topics/4709)

## Unicorn 是什么？
1. 为 Rack 应用程序设计的 HTTP server
2. 是一个利用Unix的高级特性开发的
3. 为具备低延迟，高带宽的连接的客户服务

## 特性：
1. 为 Rack， Unix， 快速的客户端和易调试而设计。
2. 完全兼容 Ruby 1.8 和 1.9。
3. 进程管理：Unicorn 会获取和重启因应用程序出错导致死亡的任务，不需要自己管理多个进程和端口。Unicorn 可以产生和管理任何数量的任务进程。
4. 负载均衡完全由操作系统(Unix)核心完成。在繁忙的任务进程时，请求也不会堆积。
5. 不需要关心应用程序是否是线程安全的，workers 运行在特们自己独立的地址空间，且一次只为一个客户端服务。
6. 支持所有的 Rack 应用程序。
7. 使用 USR1 信号来固定重复打开应用程序的所有日志文件。Unicorn 也可以逐步的确定一个请求的多行日志放在同一个文件中。
8. nginx 式的二进制升级，不丢失连接。你可以升级 Unicorn、你的整个应用程序、库、甚至 Ruby 编辑器而不丢失客户端连接。
9. 在 fork 进程时如果由特殊需求可以使用 before_fork 和 after_fork 。如果“preload_app“ 为 false 时，则不能使用。
10. 可以使用 copy-on-wirte-friendly 内存管理来节约内容（通过设置 “preload_app" 为 true ）。
11. 可以监听多接口，包括：UNIX sockets，每个 worker process 也可以在简单调试时通过 after_fork 钩子绑定到私有的端口。
12. 配置使用简单易用的 Ruby DSL。

## 安装：

    $ gem install unicorn

## 配置：
{% sh [:sh]%}
# 设定 GEM_HOME
GEM_HOME = "/Users/P.Luo/.rvm/gems/ruby-1.8.7-p340@project_name"

<!--more--> 

# 获取当前项目路径
require 'pathname'
path = Pathname.new(__FILE__).realpath # 当前文件完整路径
path = path.sub('/config/unicorn.rb', '')
APP_PATH = path.to_s

# 或直接填写
# APP_PATH = "/path_to_project/workspace/project_name"

# worker 数
worker_processes 20

# 项目目录，部署后的项目指向 current，如：/srv/project_name/current
working_directory APP_PATH 

# we use a shorter backlog for quicker failover when busy
# 可同时监听 Unix 本地 socket 或 TCP 端口
listen "/tmp/project_name.sock", :backlog => 64
# 开启tcp 端口，可不使用 apache 或 nginx 做代理，直接本地：http://localhost:port
#listen 8080, :tcp_nopush => true

# 如果为 REE，则添加 copy_on_wirte_friendly
# http://www.rubyenterpriseedition.com/faq.html#adapt_apps_for_cow
if GC.respond_to?(:copy_on_write_friendly=)
  GC.copy_on_write_friendly = true
end

# request 超时时间，超过此时间则自动将此请求杀掉，单位为秒
timeout 180

# unicorn master pid
# unicorn pid 存放路径
pid APP_PATH + "/tmp/pids/unicorn.pid"

# unicorn 日志
stderr_path APP_PATH + "/log/unicorn.stderr.log"
stdout_path APP_PATH + "/log/unicorn.stdout.log"

preload_app true

before_fork do |server, worker|
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection
end

{% endsh %}

##使用：

1. 非 Rails Rack 应用程序：
   
   unicorn

2. Rails 应用程序（支持Rails 1.2 及之后的版本）
    
    unicorn_rails

参数说明：
1. unicorn 会默认绑定到8080端口，可以使用 --listen/-l 来选择到不同的 address:port 或者使用 UNIX socket.
2. -D 以Deamon 形式启动
3. -c 设定配置文件，如我们的 /workspace/project_name/config/unicorn.rb
4. -E 设定生产环境或开发环境，如 -E production

例：

`$ unicorn_rails -E production -D -c /srv/project_name/current/config/unicorn.rb `

###重启：
* 方法一：

`$ ps auwx | grep unicorn`
获取：master 的pid
如

`$ kill -9 17357`
`$ unicorn_rails -E production -D -c /srv/project_name/current/config/unicorn.rb `

* 方法二：

在/etc/init.d/ 目录下添加 init 脚本：

`$ sudo /etc/init.d/unicorn.project_name`
Usage: `/etc/init.d/unicorn.project_name <start|stop|restart|upgrade|force-stop|reopen-logs>`

可以运行：`sudo /etc/init.d/unicorn.project_name` 来进行项目重启、停止、启动...

init 脚本示例（请更改 APP_ROOT － 项目目录 和 APP_USER － 项目所属用户 的值）：
{% sh [:sh]%}
#!/bin/sh
set -e

# Feel free to change any of the following variables for your app:
TIMEOUT=${TIMEOUT-60}
APP_ROOT=/srv/project_name/current
APP_USER=username
PID=$APP_ROOT/tmp/pids/unicorn.pid
ENV=production
CMD="bundle exec unicorn_rails -E $ENV -D -c $APP_ROOT/config/unicorn.rb"
action="$1"
set -u

old_pid="$PID.oldbin"
cd $APP_ROOT || exit 1

sig (){
        test -s "$PID" && kill -$1 `cat $PID`
}

oldsig (){
        test -s $old_pid && kill -$1 `cat $old_pid`
}
case $action in
start)
        sig 0 && echo >&2 "Already running" && exit 0
        su $APP_USER -c "$CMD"
        ;;
stop)
        sig QUIT && exit 0
        echo >&2 "Not running"
        ;;
force-stop)
        sig TERM && exit 0

        echo >&2 "Not running"
        ;;
restart|reload)
        sig HUP && echo reloaded OK && exit 0
        echo >&2 "Couldn't reload, starting '$CMD' instead"
        su $APP_USER -c "$CMD"
        ;;
upgrade)
        if sig USR2 && sleep2 && sig 0 && oldsig QUIT
        then
                n=$TIMEOUT
                while test -s $old_pid && test $n -ge 0
                do
                        printf '.' && sleep 1 && n=$(($n - 1))
                done
                echo

                if test $n -lt 0 && test -s $old_pid
                then
                        echo >&2 "$old_pid still exists after $TIMEOUT seconds"
                        exit1
                fi
                exit0
        fi
        echo >&2 "Couldn't upgrade, starting '$CMD' instead"
        su $APP_USER -c "$CMD"
        ;;
reopen-logs)
        sig USR1
        ;;*)
        echo >&2 "Usage: $0 <start|stop|restart|upgrade|force-stop|reopen-logs>"
        exit 1
        ;;
esac
{% endsh %}
