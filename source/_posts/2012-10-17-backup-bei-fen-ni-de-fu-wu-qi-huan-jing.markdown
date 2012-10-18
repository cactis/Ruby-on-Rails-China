---
layout: post
title: "Backup - 备份你的服务器环境"
date: 2012-10-17 22:24
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/1976)
服务器上面你可能需要备份数据库、配置文件、甚至上传文件。\
 每个项目中反复写备份脚本很麻烦吧，试试 Backup 这个 gem。\
 他可以帮你...

1.  备份数据库：
    -   MySQL
    -   PostgreSQL
    -   MongoDB
    -   Redis

2.  备份文件或者目录...
3.  备份日志文件...
4.  备份到:
    -   S3
    -   Dropbox
    -   SFTP
    -   FTP
    -   当然还有本地目录

5.  并且你还可以选择 gzip 或者其他的方式压缩文件
6.  备份完成以后还可以通过 Twitter, Email 等方式提醒
7.  它不仅仅只是用来备份 Ruby 项目的服务器，可以适用任何 Linux 或
    Mac，任何数据，你可以用来做本地定期备份
8.  用起来就是这么简单的定制文件，在配合 Crontab 定时执行就可以了:

<!-- -->

    Backup::Model.new(:sample_backup, 'A sample backup configuration') do

      split_into_chunks_of 4000

      database MySQL do |database|
        database.name               = 'my_sample_mysql_db'
        database.username           = 'my_username'
        database.password           = 'my_password'
        database.skip_tables        = ['logs']
        database.additional_options = ['--single-transaction', '--quick']
      end

      database MongoDB do |database|
        database.name             = 'my_sample_mongo_db'
        database.only_collections = ['users', 'events', 'posts']
      end

      archive :user_avatars do |archive|
        archive.add '/var/apps/my_sample_app/public/avatars'
      end

      archive :logs do |archive|
        archive.add     '/var/apps/my_sample_app/logs/production.log'
        archive.add     '/var/apps/my_sample_app/logs/newrelic_agent.log'
        archive.add     '/var/apps/my_sample_app/logs/other/'
        archive.exclude '/var/apps/my_sample_app/logs/other/exclude-this.log'
      end

      compress_with Gzip do |compression|
        compression.best = true
      end

      store_with SFTP, "Server A" do |server|
        server.username = 'my_username'
        server.password = 'secret'
        server.ip       = 'a.my-backup-server.com'
        server.port     = 22
        server.path     = '~/backups'
        server.keep     = 25
      end

      store_with SFTP, "Server B" do |server|
        server.username = 'my_username'
        server.password = 'secret'
        server.ip       = 'b.my-backup-server.com'
        server.port     = 22
        server.path     = '~/backups'
        server.keep     = 25
      end

      store_with S3 do |s3|
        s3.access_key_id      = 'my_access_key_id'
        s3.secret_access_key  = 'my_secret_access_key'
        s3.region             = 'us-east-1'
        s3.bucket             = 'my_bucket/backups'
        s3.keep               = 20
      end

      sync_with S3 do |s3|
        s3.access_key_id     = "my_access_key_id"
        s3.secret_access_key = "my_secret_access_key"
        s3.bucket            = "my-bucket"
        s3.path              = "/backups"
        s3.mirror            = true

        s3.directories do |directory|
          directory.add "/var/apps/my_app/public/videos"
          directory.add "/var/apps/my_app/public/music"
        end
      end

      notify_by Mail do |mail|
        mail.on_success = false
        mail.on_warning = true
        mail.on_failure = true
      end

      notify_by Twitter do |tweet|
        tweet.on_success = true
        tweet.on_warning = true
        tweet.on_failure = true
      end

    end

项目地址：
[https://github.com/meskyanichi/backup](https://github.com/meskyanichi/backup)
