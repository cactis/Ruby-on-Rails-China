---
layout: post
title: "利用OCR解析，京东商品价格"
date: 2012-10-18 11:51
comments: true
categories: RubyChina
author: mimosa
---
转载自[Ruby-China](http://ruby-china.org/topics/6105)
# -*- encoding: utf-8 -*-
    require 'rtesseract'
    require 'mini_magick'

    def parse_price(price_url)
      img = MiniMagick::Image.open(price_url)
      img.resize '200x100'   # 放大
      img.colorspace("GRAY") # 灰度化  
      img.monochrome         # 去色
      str = RTesseract.new(img.path).to_s # 识别
      File.unlink(img.path)  # 删除临时文件
      if str.nil?
        puts price_url
      else
        price = str.strip.sub(/Y/,'').to_f 
      end
    end

调用：

    parse_price('http://jprice.360buyimg.com/price/gp723049-1-1-1.png')
    # => 169999.0
