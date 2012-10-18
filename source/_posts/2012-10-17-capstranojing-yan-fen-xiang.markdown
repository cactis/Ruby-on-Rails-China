---
layout: post
title: "Capstrano经验分享"
date: 2012-10-17 22:27
comments: true
categories: Ruby-China
author: piginzoo
---
转载自[Ruby-China](http://ruby-china.org/topics/2020)
最近鼓捣capstrano并被之折磨，终于有了一些心得，不敢独享，share给大家。

**1.我们的的capstrona配置**

    # encoding: utf-8
    require 'bundler/capistrano'                #添加之后部署时会调用bundle install， 如果不需要就可以注释掉
    set   :keep_releases, 10                    #只保留10个备份
    set   :application, "myapp"     #应用名称
    set   :repository,  "git@myapp.com:/data/gitrepo/myapp"
    set   :deploy_to,   "/data/www"
    set   :current_public,   "/data/www/current/public"
    set   :shared_path,      "/data/www/shared"
    set   :user, "deploy"                       #登录部署机器(myapp.com)的用户名
    set   :password, "123456"                   #登录部署机器的密码， 如果不设部署时需要输入密码
    set   :use_sudo, false                      #执行的命令中含有sudo， 如果设为false， 用户所有操作都有权限
    set   :scm, :git
    set   :bundle_flags, '--quiet'
    set   :copy_exclude, [".git", "spec"]
    set   :group_writable, false
    role  :web, "192.168.0.106"                     #Your HTTP server, Apache/etc
    role  :app, "192.168.0.106"                     #This may be the same as your `Web` server
    role  :db,  "192.168.0.106", :primary => true   #This is where Rails migrations will run
    default_run_options[:pty] = true            #pty: 伪登录设备
    #after， before 表示在特定操作之后或之前执行其他任务
    after "deploy:update", "deploy:migrate"
    after "deploy:migrate", "deploy:symbol_resource"
    # If you are using Passenger mod_rails uncomment this:
    namespace :deploy do
      desc "restart the paozhoumo application"
      task :restart, :roles => :app, :except => { :no_release => true } do
       run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
       # rails 3.1首次访问时间较长，发布成功后先访问一下，进行初始化
       run "curl -s -o /dev/null 127.0.0.1"
      end
      #用新的拉下来的public里面的内容替换旧的shared目录的，然后删除掉public，用shared链接到public
      desc "copy everyting to overwrite the shared public folder"
      task :symbol_resource do
        #拷贝新拉下来的images/css/jslib,以及目录下的文件
        run "rm -rf #{shared_path}/images/*"
        run "cp -r #{current_public}/images/* #{shared_path}/images/"
        run "rm -rf #{shared_path}/css/*"
        run "cp -r #{current_public}/css/* #{shared_path}/css/"
        run "rm -rf #{shared_path}/jslib/*"
        run "cp -r #{current_public}/jslib/* #{shared_path}/jslib/"
        run "rm -f #{shared_path}/*.*"
        run "cp #{current_public}/*.* #{shared_path}"
        #然后把拉下来的public目录删除掉
        run "rm -rf #{current_public}"
        #把共享的share文件夹中
        run "ln -sf #{shared_path} #{current_public}"
      end
    end

**2.几点说明：**

这里有两个帐号，一个是“git@myapp.com:/data/gitrepo/myapp”，也就是git服务器上的git帐号，还有一个是要部署到某台机器上的时候登录用的帐号：deploy。因此，如果你做本地的ssh的密码配置，在cap
deploy过程中，需要输入git用户的密码，和deploy用户的密码。

这里有3台机器将卷入这个部署

1.  你的开发机
2.  你的git服务器（放着team的merge后的代码滴最新版）
3.  你要去部署的服务器

过程就是你在你的开发机器上运行 cap
deploy，然后远程登录到被部署的机器上跑cap的脚本，期间会自动到git服务器上拉代码，过程大抵如此。

后面我trace了一个整个过程的shell脚本，并加上注释，可以细看。

在第一次运行 cap
deploy:setup的时候，会报权限错误，毕竟deploy用户权限很低，不能随便创建目录，那么就用root或者其他有权限的帐号，先建好my
app的根目录，然后chown deploy:deploy\_group /my\_app\_root即可。

由于脚本中有了这行require 'bundler/capistrano'
，cap会在部署的时候，重新拉一份gem下来，放到 shared/bunld目录下，
即使你生产机器上已经有gem了，小哥们还是会不知疲倦地下载一份，原因是，这个脚本触发了这条命令：bundle
install --gemfile /data/www/releases/20120321020234/Gemfile --path
/data/www/shared/bundle --quiet --without development
test.我曾经担心过rails启动的时候，是去找这里面的gem还是去找系统目录下的gem呢，后来得知在Myapp目录下会生成一个
.bundld/config，告诉rails用哪个gem目录，就释然了。

**3. cap运行过程中的脚本：**

    #列出remote上最新的head
    git ls-remote deploy@paozhoumo.com:/data/gitrepo/paozhoumo HEAD
    #做一些目录清场和准备
    rm -rf /data/www/releases/20120321020234/public/assets 
    mkdir -p /data/www/releases/20120321020234/public        
    mkdir -p /data/www/shared/assets
    #做1个软连接，后面还有3个
    ln -s /data/www/shared/assets /data/www/releases/20120321020234/public/assets
    #改变目录为组可写
    chmod -R g+w /data/www/releases/20120321020234
    rm -rf /data/www/releases/20120321020234/log /data/www/releases/20120321020234/public/system /data/www/releases/20120321020234/tmp/pids 
    mkdir -p /data/www/releases/20120321020234/public
    mkdir -p /data/www/releases/20120321020234/tmp
    #做了3个软连接
    ln -s /data/www/shared/log /data/www/releases/20120321020234/log
    ln -s /data/www/shared/system /data/www/releases/20120321020234/public/system
    ln -s /data/www/shared/pids /data/www/releases/20120321020234/tmp/pids
    #重新touch一下这些目录中的所有的文件
    find /data/www/releases/20120321020234/public/images /data/www/releases/20120321020234/public/stylesheets /data/www/releases/20120321020234/public/javascripts -exec touch -t 201203210202.50 {} ';'; true
    #列出文件来，-x是在一行的意思，不知道要干嘛？
    ls -x /data/www/releases
    cd /data/www/releases/20120321020234
    #安装bundle到/shared/bundle里面，但是用的Gemfile是新拉下来的gemfile
    bundle install --gemfile /data/www/releases/20120321020234/Gemfile --path /data/www/shared/bundle --quiet --without development test
    cd /data/www/releases/20120321030939
    #做资源预编译，地球人都知道
    bundle exec rake RAILS_ENV=production RAILS_GROUPS=assets assets:precompile
    #改链接之类的后续活
    rm -f /data/www/current && ln -s /data/www/releases/20120321030939 /data/www/current
    cd /data/www/releases/20120321030939
    #执行migration
    bundle exec rake RAILS_ENV=production  db:migrate
    。。。。
    # 后面就没啥了

**4.参考：**

官方给的流程图：\
![](https://github.com/mpasternacki/capistrano-documentation-support-files/raw/master/default-execution-path/Capistrano%20Execution%20Path.jpg)

-   [http://blog.csdn.net/largetalk/article/details/6743090](http://blog.csdn.net/largetalk/article/details/6743090)
-   [http://railscasts.com/episodes/133-capistrano-tasks](http://railscasts.com/episodes/133-capistrano-tasks)
-   [https://github.com/capistrano/capistrano/wiki/2.x-Significant-Configuration-Variables](https://github.com/capistrano/capistrano/wiki/2.x-Significant-Configuration-Variables)
-   [http://kris.me.uk/2010/08/30/rails3-hosting-all-in-one.html](http://kris.me.uk/2010/08/30/rails3-hosting-all-in-one.html)
-   [http://seamon.iteye.com/blog/1166012](http://seamon.iteye.com/blog/1166012)\
