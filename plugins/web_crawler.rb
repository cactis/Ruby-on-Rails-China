#coding: utf-8
require 'nokogiri'
require 'mechanize'
require 'YAML'
require "stringex"
require 'pandoc-ruby'



module Jekyll
  class WebCrawler
    LIKES_BRAKE = 10 
    MAX_ATTEMPTS = 10
    def initialize(site, base)
      @site = site
      @url = site.config['web_crawler_sites']
      @base = Dir.pwd
       
      record_file = File.join(base, 'crawler_record.yml')
      
      
      #  create a new record file if the file not exist 
      unless File.exist?(record_file)
        init_record = Hash.new
        @url.each {|e| init_record.merge!({e=>0})}
        init_record = init_record.to_yaml
        File.open(record_file,"w") do |f|
           f.puts init_record
        end
      end
      @record = YAML.load_file(record_file)
    end    

    def start_scratch!
      @record.each_pair do |website,record|
        @record.merge!({website => do_scratch(website,record) })
      end
    end

    private

    def do_scratch(website,record)
      agent = Mechanize.new  
      attempts = 0
      begin
        while(true)
          record += 1
          source = website+record.to_s
          puts "start scratching NO.#{record} topic"
          page = agent.get(source)
          like = page.search("//div[@class='tools pull-right']").search(".//span").text
          /(\d+)/ =~ like
          if($1)
            if ($1.to_i >= LIKES_BRAKE)
              puts "Topic #{record} satisfied condition,start generate post"
              content = page.search("//div[@class='body entry-content'] ").to_html
              author = page.search("//a[@data-author]").text
              title = page.search(".//h1[@class='entry-title']").text
              content.sub!("<div class=\"body entry-content\">",'')
              content.sub!("</div>",'')
              generate_post(content,author,title,"Ruby-China",source)
            else
              puts "...only #{$1} likes,discarding..."
            end
          else
            puts "...no one like it ,discarding..."
          end
          attempts = 0 
        end
      rescue Exception => ex
        puts  "topic #{record} no found , try next topic"
        if ex.message[0..2] == '404'
          record += 1
          attempts += 1
          if(attempts < MAX_ATTEMPTS)
            retry 
          else
            puts 'generated the latest topics,done'
            return record
          end
        elsif ex.is_a? SocketError
          puts "Timeout! getting NO.#{attempts} trying"
          attempts = attempts + 1
          retry if(attempts < MAX_ATTEMPTS)
        else
          raise ex
        end
      end
      return record
    end
    def generate_post(content,author,title,site_name,address)
      filename = "#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.markdown"
      post = File.join(@base,'source', '_posts',filename)
      if File.exist?(post)
        puts("aborted! the post file have exist!") 
      else
        content = content
        content.sub!("<div class=\"body entry-content\">",'')
        content.sub!("</div>",'')
        puts "Creating new post: #{filename}"
        doc = PandocRuby.convert(content,:from => :html,:to => :markdown)
        open(post, 'w') do |p|
          p.puts "---"
          p.puts "layout: post"
          p.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
          p.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M')}"
          p.puts "comments: true"
          p.puts "categories: #{site_name}"
          p.puts "author: #{author}"
          p.puts "---"
          p.puts "转载自[#{site_name}](#{address})"
          p.puts doc
        end
      end
    end

  end

  class Site
    def web_scratch!
      @wc = WebCrawler.new(self,self.source)
      @wc.start_scratch!
    end
  end

  class GenerateScratchArticle < Generator
    safe true
    priority :low

    def generate(site)
      site.web_scratch!
    end

  end


end
