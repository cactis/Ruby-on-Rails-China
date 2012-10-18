---
layout: post
title: "Railscasts全部免费视频下载"
date: 2012-10-17 21:53
comments: true
categories: Ruby-China
author: _samqiu
---
转载自[Ruby-China](http://ruby-china.org/topics/472)
以前学习任何东西都不喜欢看视频，Railscasts是例外。

[https://gist.github.com/1472142](https://gist.github.com/1472142)
这个Gist也含有直接下载链接（不含收费的），可以用迅雷直接下。

脚本是搜索到的，版权不明哈：）

    #!/usr/bin/ruby
    require 'rss'

    p 'Downloading rss index'

    rss_string = open('http://feeds.feedburner.com/railscasts').read
    rss = RSS::Parser.parse(rss_string, false)
    videos_urls = rss.items.map { |it| it.enclosure.url }.reverse

    videos_filenames = videos_urls.map {|url| url.split('/').last }
    existing_filenames = Dir.glob('*.mov')
    missing_filenames = videos_filenames - existing_filenames
    p "Downloading #{missing_filenames.size} missing videos"

    missing_videos_urls = videos_urls.select { |video_url| missing_filenames.any? { |filename| video_url.match filename } }

    missing_videos_urls.each do |video_url|
      filename = video_url.split('/').last
      next if File.exists? filename
      p filename
      p %x(wget #{video_url} -O #{filename}.tmp )
      p %x(mv #{filename}.tmp #{filename} )
    end
    p 'Finished synchronization'
