---
layout: post
title: "OmniAuth - 實作多方認證的最佳實踐"
date: 2012-08-02 16:16
comments: true
categories: development
tags: ['OminiAuth','最佳实践','xdite']
author: xdite
---

转载自 [xdite的blog](http://blog.xdite.net)，原本是分成四部分，关于 OminiAuth 的问题基本可以在这里面找到答案。
这四篇博文的地址：

* [OmniAuth - 實作多方認證的最佳實踐(1)](http://blog.xdite.net/posts/2011/11/19/omniauth-clean-auth-provider-1/)

* [OmniAuth - 實作多方認證的最佳實踐(2)](http://blog.xdite.net/posts/2011/11/19/omniauth-clean-auth-provider-2/)

* [OmniAuth - 實作多方認證的最佳實踐(3)](http://blog.xdite.net/posts/2011/11/19/omniauth-clean-auth-provider-3/)

* [OmniAuth - 實作多方認證的最佳實踐(4)](http://blog.xdite.net/posts/2011/12/05/omniauth-clean-auth-provider-4/)

# 第一部分

這幾天在寫一個小玩具，因為要用到 Github 認證，於是採取了 [OmniAuth](https://github.com/intridea/omniauth) + [Devise](https://github.com/intridea/omniauth) 這組作法。因為適逢 OmniAuth 在十月底一舉從 v0.3 大改版，直衝到 v1.0。版號大躍進，整個架構與 API 也幾乎全都不一樣了，網路上的教學幾乎等於作廢，加上 Github 原本實作的 OAuth 2.0 本來就不太標準，吃了幾個小時苦頭，終於才把認證搞定。不過也拜這一晚的折騰，讓我把 OmniAuth 架構摸個更加透徹。

## 多方認證的需求

現在作網站，使用者的要求比以往的高。在過往，幾乎都是站方的姿態較高，使用者要試用一個網站前，無不是必須填一堆資料，勾完一堆囉哩八縮的選項，才能加入這個網站。

但隨著時代的改變，Facebook Connect 的普及，現在網路生態卻跟以前完全相反，如果你的網站不提供傳統帳號密碼以外的方案（諸如 Facebook Connect、Google ID …etc.）使用者二話不說，絕對馬上就閃人。反正網站那麼多，不差哪一個…

於是提供傳統帳號密碼以外的註冊方案，對一個新創網站就顯得格外重要。

## 實作上的困難

話雖如此，但是實作上是真的有很大的困難的。就拿 Rails 生態圈好了，[傳統帳號密碼方案](https://www.ruby-toolbox.com/categories/rails_authentication) 有非常多套：Devise、Authlogic、Restful-authenication 等等。而實作第三方認證的功能也是相當多元的，你可以拿 Facebook API 的 gem 或者是 Google OAuth 的 gem 直接硬幹整合這些方案，也是做的出來。

理想的境界應該是一個網站最好只要提供一個 3rd Party 的認證，而且認證 Library 與 API 存取機制，不能要有太大的變化。

但這真的只是理想而已，現實上你會遇到三類大挑戰：

### 1. PM 亂開規格

PM 不會管你死活，硬是要你同時既提供 Facebook / OpenID / Yahoo Auth / Google OpenID。天知道這些網站認證和存取 API 的規格完全都不一樣。

硬是把這些方案一起塞到一個 controller 和同一個 model，瞬間就會無法維護。不…很可能是 code 亂到讓自己狂跌倒，直接作不出來

<!--more--> 

### 2. OAuth 版本規格間的問題

理想的境界應該是大家都走 OAuth 就能夠解決問題，但是 OAuth 1.0 推出時，鬧了一個大笑話：被發現有 security issue。於是 OAuth 推出了 1.0a 的修補方案，但這又衍生出另外一個問題：每一家解決 security issue 機制完全不一樣。

因為 service provider 的機制完全不一樣，就造成了已經上路使用 OAuth 的網站大囧。因為 1.0a 那步要變成客製。其實大家做的調整都差不多，但當時有一家是來亂的：Yahoo ….

因為 Yahoo 實在太特例，還造成當時 OAuth 這個 rubygem 的作者，拒絕支援 Yahoo（因為要做的修改不只是「小」修改而已）。

這件事實在是太囧了，於是 OAuth 在不久後，又提供了一個解決方案：直接提出 OAuth 2.0!

鬧劇到這裡就結束了嗎？

沒有。

因為 OAuth 2.0 不相容 1.0a 及 1.0 …

好吧，那算了，大家還是繼續裝死使用 1.0x …

還沒有結束喔！

原本完全不鳥 OAuth 的 Facebook 這時候宣布即將放棄自己的 Facebook Connect 架構，宣布未來直接擁抱 OAuth 2.0。

崩潰。一個專案上跑 n 種 OAuth library 是什麼鬼….

[ 如果你是沒什麼信念的 Web Developer，看到這裡我建議你可以轉行 ]

### 3. 大網站本身直接的 API 改版以及認證機制的改變

一個網站只要還沒倒，就不可能一直停滯不前。更尤有甚者如 Facebook，它的 API 更是三天一小改，五天一大改。而 FB 的 認證架構 和 API 一改，相對的 library wrapper 就一定會跟著改。

這就苦到那一些直接使用 library 接認證的開發者。

而 FB 改版就已經夠令人苦惱，其他網站不可能也像一攤死水，Google 也改很大….。從之前只是 OpenID + API 存取，改成直接走 OAuth …

你也許會問，為何要使用 library 直接接認證呢？那是不用獨立 library 接認證有時候也不太行得通，因為每一家提供使用者資訊的「方式」和「資料格式」幾乎不一樣。有時候還要分好幾步才能拿到令人滿意的結果

## 理想的解決方案

當 Web Developer 實在太苦了，賣雞排真的比較輕鬆 :/

理想中 Developer 們需要的解決方案應該是這樣的：

開發者不需管最底層的傳統認證方案是哪一套 solution，甚至是不只局限於 Rails 這個框架
開發者不需管提供認證方使用的是哪一套協定
開發者拿到的使用者資料格式應該是接近一致的
這套方案存在嗎？

存在，它就是 [OmniAuth](https://github.com/intridea/omniauth) + [Devise](https://github.com/intridea/omniauth) 。

# 第二部分

[OmniAuth](https://github.com/intridea/omniauth) + [Devise](https://github.com/intridea/omniauth) 本身並不是一套被限於特定框架、特定認註冊系統上的認證方案，而是一個基於 Rack 的「認證策略提供者」。

## 主要架構

### Provider

OmniAuth 將所有的認證提供方，通通視為不同的 Provider，每一種 Provider 有一個 Strategy。不管你是 Facebook、還是 LDAP，通通擁有各自的 Strategy。

### Strategy

每一個 Strategy 分為兩個 Phase：

* request phase
* callback phase

而 Omniauth 提供了兩個主要的 url

 `/auth/:provider`
 `/auth/:provider/callback`

當使用者 visit /auth/github 時，OmniAuth 會將你導到 Github 去作認證。而認證成功之後，會 redirect 到 callback 網址。通常我們會在 callback 網址作 session create 動作（透過拿回來的資料 find_or_create user）

## 使用 Strategy 的好處

使用 Strategy 的好處很多。最明顯的我覺得有幾點：

 1.能夠將 routhing 切得很乾淨。

這點顯而易見。

 2.能夠在網路不通下繼續實作認證。

有時候開發中，可能正用本機網址，無法實作 callback。有時候則是網路不通。OmniAuth 可以讓我們使用一套 developer strategy 去 “fake”。

所以在開發過程中，即便遇到網路問題，我們還是可以透過寫 developer strategy 的方式，拿到同格式的假資料，完成假認證、假 callback。

{%sh [:ruby] %}
require 'omniauth/core'
module OmniAuth
  module Straegies
    class Developer
      include OmniAuth::Strategy

      def initialize(app, *args)
        supper(app, :developer, *args)
      end

      def request_phase
        OmniAuth::Form.build url:callback_url, title: "Hello developer" do
          text_field "Name", "name"
          text_field "Email", "email"
          text_field "Nickname", "nickname"
        end.to_response
      end

      def auth_hash
        {
          'provider' => 'twitter'
          'uid' => request['email'],
          'user_info' =>
          {
            'name' => request['name'],
            'email' => request['email'],
            'nickname' => request['nickname']
          }
        }
      end
    end
  end
end
{% endsh %}

（ 這是 0.3 範例，出處為 OmniAuth, 昨天今天明天）

而新的 1.0 Strategy Guide 已經 釋出，一個 Strategy 需要完成的部分大致上有這三個：

1.request phase 如何完成
2.callback phase 如何完成
3.定義回傳需拿到的資料：如 provider name、uid、email、以及 extra info
User Info

在 0.3 版的範例裡面，可以看到回傳的資訊是使用 auth_hash 去包。這也導致了另一個混亂的情形，各種不同的 Strategy 寫了不同的 auth_hash，把 auth_hash 拉回來時，create User 的介面相當混亂與醜陋。

而自 1.0 版起，這些使用者資訊將會切成四種 DSL methos : info, uid, extra, 和 credentials。

{%sh [:ruby] %}
class OmniAuth::Strategies::MyStrategy < OmniAuth::Strategies::OAuth
  uid { access_token.params['user_id'] }

  info do
    {
      :first_name => raw_info['firstName'],
      :last_name => raw_info['lastName'],
      :email => raw_info['email']
    }
  end

  extra do
    {'raw_info' => raw_info}
  end

  def raw_info
    access_token.get('/info')
  end
end
{% endsh %}
把基本資訊的存取切分的更清楚。

讓我把各家新版的 Strategy 翻出來介紹給大家吧：

看完這些 example，相信你可以更了解這些資訊架構後面的想法是什麼。

[omniauth-twitter](https://github.com/arunagw/omniauth-twitter/blob/master/lib/omniauth/strategies/twitter.rb)

[omniauth-facebook](https://github.com/mkdynamic/omniauth-facebook/blob/master/lib/omniauth/strategies/facebook.rb)

[omniauth-githuib](https://github.com/intridea/omniauth-github/blob/master/lib/omniauth/strategies/github.rb)
## 小結

而因為 OmniAuth 是 rack-middleware，且介面單純的緣故（ 兩組統一 url），因此可以接在各種任何支援 Rack 的 Ruby Web Framework 上，在這一層之上就完成握手交換資訊的互動。於是整個認證過程就可以與「框架」和「框架上的傳統認證方案」完全切割分離，開發者可以透過這兩組介面完成傳送與接收資訊的動作，而不需像傳統實作，必須大幅客製 controller 與 routing 遷就 provider。

# 第三部分

OmniAuth 是在 2011/11/2 正式釋出 v1.0 版的，其實也就是不久之前而已…

這個大改版也讓我吃足苦頭，因為 0.3 與 1.0 的架構差太多，網路上 Google 到的文件反而會打爆我的 application，除錯了很久。

不過也因為這件事情，逼我在幾個小時之內認真看了不少關於認證的想法與文件，才從而理解這些架構，寫出這些文章…。

0.3 與 1.0 的差異

0.3 與 1.0 的差異，在於 1.0 的架構更直覺、更乾淨。主要改變有二：

* Strategy as Gem

* 標準的資料介面

## Strategy as Gem

在 0.3 版，如果開發者想在 Rails project 內使用 Twitter 的認證。除了必須在 Gemfile 內宣告使用 OmniAuth

    gem "omniauth"

還必須使用一個 initializer 去 claim 他要使用 Twitter 認證

{%sh [:ruby] %}
#config/initializers/omniauth.rb
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, 'CONSUMER_KEY', 'CONSUMER_SECRET'
end
{%endsh%}

而在 1.0 中

開發者只需要這樣作，在 Gemfile 裡面宣稱他要使用 OmniAuth 和 OmniAuth-Twitter


    gem "omniauth"
    gem "omniauth-twitter"

其實也是這個細微的差異，害我誤入歧途，我按照網路上找到的方案，也在 1.0 版乖乖多寫了一個 initializer 去宣告使用，反而造成 invalid credential。

## OAuth 惡夢

當然將 Strategy 抽出來當成 Gem 是一件好事，這樣就不用因為某一個認證方 API 改版，就必須 fork 整個 OmniAuth 出來使用。

不過促使 OmniAuth 改版最痛的問題可能是 OAuth 的問題。

我也是因為實作 Github 的認證才發現到這個令人憤怒的 issue。

> BTW: 講個不好笑的笑話，開發與 Github 結合的產品真的很令人困擾，因為你無法使用 “xxx github” 這樣的關鍵字在搜尋引擎找答案，因為結果一定會出現 xxx 在 Github 上的 repo。翻桌！=_=||| 

這是 OmniAuth 0.3 版當時的 [oa-oauth](https://github.com/intridea/omniauth/tree/3aff8a3d71a5c968f558172750a2a20165d77bc5/oa-oauth/lib/omniauth/strategies) 目錄夾。你可以各家看到關於 OAuth 的認證實作多麼的混亂，逼得開發者只好寫出超多不同的 solution 去應對！

而 Github 雖然號稱已經支援 [OAuth 2.0](https://github.com/blog/656-github-oauth2-support) (賀!?)，但令人崩潰的是，它也不是標準的。Rails in Action 作者 Ryan Bigg 在寫作此本書範例程式的認證部分時，曾經憤怒的發現這一個事實，並把故事始末紀錄在這篇文章[Whodunit: Devise, OmniAuth, OAuth or GitHub?](http://ryanbigg.com/2011/04/whodunit-devise-omniauth-oauth-or-github/)

OAuth 2.0 的規格說，token param 必須命名為 oauth_token，而 Github 的卻叫作 access_token。

而且 Github 不打算修這個問題…

所以如果在 0.3 版的 OmniAuth，你必須要 hack OAuth2 這個 gem 才能支援 Github…。而如果你同時要想支援 Facebook 認證，那就哭哭了 T_T

###小結

而既然大家都這麼亂搞，不如把 Strategy 通通抽出來讓開發者在自己的黑箱內惡搞，可能還是比較快的一個方式….

## 標準的資料介面

在 OmniAuth 拿資料的方式是存取 env["omniauth.auth"] 這個變數，裡面會回傳認證需要的參數與資訊。

這個目錄 含蓋了所有目前 OmniAuth 0.3 支援的 Strategy，可以看到大家的 auth_hash 通通都寫的不一樣，也是各自為政。

所以在 1.0 版，OmniAuth 將強迫大家走同樣的規格回來，這些使用者資訊將會切成四種 DSL methods : info, uid, extra, 和 credentials。

這個部分在上一篇談架構時已經寫過，就不再重寫一遍了。

## 小結

經過這一番折騰，最後我還是成功用 OmniAuth 1.0 實作了 Github 認證。我將在下一節中示範如何整合。

但如果你還是想要用 0.3 實作 OmniAuth + Github 。我推薦你可以參考這篇 Stackoverflow 上的 [GitHub OAuthusing Devise+OmniAuth](http://stackoverflow.com/questions/5611023/github-oauth-using-devise-omniauth)討論。

Ryan Bigg 有個[ticketee](http://github.com/rails3book/ticketee)  可以參考。（我不保證它能動）

Markus Proske 也有個 [omniauth_pure](http://github.com/markusproske/omniauth_pure) 可以看。

Good Luck!

# 第四部分

本來還在煩惱怎樣給出一個 demo app。剛好最近幫忙翻修 [](http://ruby-taiwan.org)。網站的 0.3 => 1.0 的升級就是出於筆者之手。

乾脆拿這個網站直接來講…

若最後還是看不懂示範的可以直接 [clone]() 專案下來直接 copy。

## Install Devise

### 安裝 Devise

`rails g devise User` 產生 User model
`rails g model Authorization provider:string user_id:integer uid:string` 產生 Authorization Model


{%sh [:ruby]%}
class User < ActiveRecord::Base
  has_many :authorizations
end
class Authorization < ActiveRecord::Base
  belongs_to :user
end
{%endsh%}

### Install OmniAuth

安裝 OmniAuth 1.0

安裝 omniauth-github 與 omniauth-twitter

    gem 'devise', :git => 'https://github.com/plataformatec/devise.git'
    gem "omniauth"
    gem "omniauth-github"
    gem "omniauth-twitter"

### 定義 :omniauthable

在 User model 內加入 :omniauthable

{%sh [:ruby]%}
devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :trackable, :validatable, :omniauthable
extend OmniauthCallbacks
{%endsh%}

### 在 `User model`中 `extend OmniauthCallbacks`

 app/model/user.rb

{%sh [:ruby]%}
class User < ActiveRecord::Base
  extend OmniauthCallbacks
end
{%endsh%}

新增 `app/model/users/omniauth_callbacks.rb`
具體內容請看這裡 <https://github.com/rubytaiwan/ruby-taiwan/blob/master/app/models/user/omniauth_callbacks.rb>

主要是拿 `callbacks` 回來的東西 `new_from_provider_data` 塞進去。先找有沒有，有找到回傳 `user` 。沒找到從 `data` 裡塞資料進去，同時建立 provider 與 uid 關係。

### 設定 route 與 controller

config/routes.rb

{%sh [:ruby]%}
  devise_for :users, :controllers => {
    :registrations => "registrations",
    :omniauth_callbacks => "users/omniauth_callbacks"
  } do
    get "logout" => "devise/sessions#destroy"
  end
{%endsh%}

app/controllers/users/omniauth_callbacks_controller.rb

具體內容看這裡 <https://github.com/rubytaiwan/ruby-taiwan/blob/master/app/controllers/users/omniauth_callbacks_controller.rb>

光用 `app/model/users/omniauth_callbacks.rb` 與 `app/controllers/users/omniauth_callbacks_controller.rb` 這兩招就可以把 callback 和 provider 切得很漂亮了。

### 申請 OAuth

各大網站都有審請 OAuth 的機制：

Twitter: <https://dev.twitter.com/apps/new>
Github: <https://github.com/account/applications>

### 設定 token

key 設定都放在這裡 config/initializers/devise.rb

<https://github.com/rubytaiwan/ruby-taiwan/blob/master/config/initializers/devise.rb>

config/initializers/devise.rb
{%sh [:ruby]%}
config.omniauth :github, Setting.github_token, Setting.github_secret
config.omniauth :twitter, Setting.twitter_token, Setting.twitter_secret
config.omniauth :douban, Setting.douban_token, Setting.douban_secret
config.omniauth :open_id, :store => OpenID::Store::Filesystem.new('/tmp'), :name => 'google', :identifier => 'https://www.google.com/accounts/o8/id', :require => 'omniauth-openid'
{%endsh%}

### Link Helper

可看 <https://github.com/rubytaiwan/ruby-taiwan/blob/master/app/views/devise/sessions/new.html.erb>

{%sh [:html]%}
          <li><%= link_to "Twitter", user_omniauth_authorize_path(:twitter) %> </li>
          <li><%= link_to "Google", user_omniauth_authorize_path(:google) %> </li>
          <li><%= link_to "Github", user_omniauth_authorize_path(:github) %> </li>
          <li><%= link_to "Douban", user_omniauth_authorize_path(:douban) %> </li>
{%endsh%}
### 小結

這樣就設完了，非常乾淨。如果有任何問題歡迎上 http://ruby-taiwan.org 討論。
