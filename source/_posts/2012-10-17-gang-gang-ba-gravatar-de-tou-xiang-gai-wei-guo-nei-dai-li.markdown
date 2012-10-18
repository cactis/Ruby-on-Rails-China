---
layout: post
title: "刚刚把 Gravatar 的头像改为国内代理"
date: 2012-10-17 22:27
comments: true
categories: Ruby-China
author: huacnlee
---
转载自[Ruby-China](http://ruby-china.org/topics/2028)
之前一直没有想起，其实可以在 Nginx 上面做个反向代理来提高 Gravatar
头像的加载速度的...\
 现在已经部署上去了。

For Ruby China 开发者们，注意 `config.yml` 里面多了个 `gravatar_proxy`
配置项。

感谢 Python China 提醒。

Nginx 配置方法:

    http {
      proxy_cache_path  /var/cache/nginx levels=1:2 keys_zone=gravatar:8m max_size=10000m inactive=600m;
      proxy_temp_path /var/cache/nginx/tmp;

      server {
        listen 80;
        server_name ruby-china.org;

        location /avatar {
          proxy_redirect     off;
          proxy_set_header   Host $host;
          proxy_set_header   X-Forwarded-Host $host;
          proxy_set_header   X-Forwarded-Server $host;
          proxy_set_header   X-Real-IP        $remote_addr;
          proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
          proxy_pass         http://gravatar.com;
          proxy_cache ruby_china;
          proxy_cache_valid  200 302  300d;
          proxy_cache_valid  404 502  1m;
          expires           7d;
        }
      }
    }
