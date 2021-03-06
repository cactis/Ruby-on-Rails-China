---
layout: post
title: "SASS 和Compass 指南"
date: 2012-07-31 15:35
comments: true
categories: development
author: lilu
tags: ['scss','compass','sass','前端'] 
---
转自[Lilu的blog](http://lilulife.com/blog/2012/07/18/sass/)

# CSS预处理器

CSS预处理器(CSS Preprocessor)，是一种构架于css之上的高级语言，可以通过脚本编译生成CSS代码，其目的是为了让CSS开发者的工作更简单有趣，当前已经进入了较为成熟的阶段，基本上新的web开发项目大都已普遍使用。

现在最主要的选择有：

* [SASS](http://sass-lang.com/) 2007年诞生，最早也是最成熟的CSS预处理器，拥有ruby社区的支持和compass这一最强大的css框架，目前受LESS影响，已经进化到了全面兼容CSS的SCSS。
* [LESS](http://lesscss.org%5D/) 2009年出现，受SASS的影响较大，但又使用CSS的语法，让大部分开发者和设计师更容易上手，在ruby社区之外支持者远超过SASS，其缺点是比起SASS来，可编程功能不够，不过优点是简单和兼容CSS，反过来也影响了SASS演变到了SCSS的时代，著名的Twitter Bootstrap就是采用LESS做底层语言的。
* [Stylus](http://learnboost.github.com/stylus/)，2010年产生，来自Node.js社区，主要用来给Node项目进行CSS预处理支持，在此社区之内有一定支持者，在广泛的意义上人气还完全不如SASS和LESS。
我较为推崇的组合是，SASS+Compass+Twitter Bootstrap+bootstrap-sass，这一组合能够获得最好的底层语言SASS，最好的框架Compass，和Bootstrap提供的最强大的UI组件库(被bootstrap-sass翻译成SASS的风格)。

下面就对SASS的常用要素做一简单介绍，大部分例子来自SASS设计者Hampton Catlin的著作[Pragmatic Guide to Sass](http://pragprog.com/book/pg_sass/pragmatic-guide-to-sass)，本文 _不涉及_安装过程，命令行工具，和其他web开发框架(比如Rails)的结合，早期非SCSS的语法等内容，想了解更多的朋友可深入阅读上边这本书。

<!--more--> 
## 嵌套(nesting)

{% sh [:css] %}
    /*CSS选择器(Selector)经常要重复class,id和element的名称*/
    .infobox {width: 200px;}
    .infobox .message {border: 1px solid red;}
    .infobox .message > .title {color: red;}
    //SASS可以让选择器嵌套，做到DRY
    .infobox {
        width: 200px;
        .message {
            border: 1px solid red;
            > .title {color: red;}
        }
    }
{% endsh %}

对于某些需要引入父选择器名称的情况，SASS使用&代替

{% sh [:css] %}
/*CSS会让同样元素的样式变得分散*/
.infobox {color: blue;}
.user .infobox {color: gray;}
.message {color: gray;}
.message.new {color: red;}
//SASS可以让他们在一起
.infobox {
    color: blue;
    .user & {color: gray;}
}
.message {
    color: gray;
    &.new {color: red;}
}
{% endsh %}
对于当前做跨平台web开发来说，@media非常常用，而SASS的嵌套会区别对待
{% sh [:css] %}
/*CSS*/
.main {
    font-size: 15px;
}    

@media screen and (max-width: 320px) {
    .main {
        font-size: 35px; 
    }
}
//SASS让同样的选择器在不同media条件下的样式在一起
.main {
    font-size: 15px;
    @media screen and (max-width: 320px) {
        font-size: 35px; 
    } 
}
{% endsh %}
## 变量(variables)

变量是编程语言的基石，掌握变量的定义和使用，是SASS编程的起点。
{% sh [:css] %}
/*CSS中同样的值不得不重复很多次*/
body {background: #336699;}
body #wrapper {
    width: 300px;
    background: white;
    border: #eee; 
}
body #wrapper h1 {color: #336699;}
//SASS有了变量，只需要改一次，而且往往相关值一起定义的，方便查找
//可以定义全局变量
$primary_color: #369;
$secondary_color: #eee;

body {
    //也可以定义局部变量
    $page_width: 300px;

    background: $primary_color;
    #wrapper {
        width: $page_width;
        background: white;
        border: $secondary_color;
        h1 {color: $primary_color; } 
    } 
}
{% endsh %}
关于上边代码中的全局和局部变量，这里稍微说一下SASS的缺点，同名局部变量会覆盖全局变量的值，这很不自然
{% sh [:css] %}
//SASS这一点不如LESS
$color: black;           
.scoped { 
    $color: white;
    color: $color;        
}                        
.unscoped {     
    // LESS = black (global)
    // SASS = white (overwritten by local)
    color: $color;          
}
{% endsh %}
有了变量，自然可以进行对值的计算
{% sh [:css] %}
    //Calculating in SASS
    //以下代码中修改页面宽度只需要改一次
    $width: 500px;
    $sidebar_percent: 0.2;
    #page {
        width: $width;
        #sidebar {width: $width * $sidebar_percent;}
        #content {width: $width * (1 - $sidebar_percent);} 
    }
{% endsh %}
变量还可以嵌入字符串中，这在编程语言中称为插值(Interpolating)
{% sh [:css]} %}
    //Calculating in SASS
    //以下代码中修改页面宽度只需要改一次
    $width: 500px;
    $sidebar_percent: 0.2;
    #page {
        width: $width;
        #sidebar {width: $width * $sidebar_percent;}
        #content {width: $width * (1 - $sidebar_percent);} 
    }
{% endsh %}
变量还可以嵌入字符串中，这在编程语言中称为插值(Interpolating)

{% sh [:css]} %}
//CSS 
.car.bmw_make {color: blue;}   
.car.bmw_make .image {
    background: url("images/bmw.png");
}
//Interpolating in SASS
$car: "bmw";

.car.#{$car}_make {s
    color: blue;
    .image {
        background: url("images/#{$car}.png");
    }
}
{% endsh %}
## 函数(function)

在编程语言中，函数是仅此于变量的基本结构体，SASS中有很多预定义函数，这里用颜色相关的函数举例如下

{% sh [:css] %}
/*CSS需要定义整套颜色*/
.main {color: #336699;}
.lighten {color: #6699cc;}
.saturate {color: #1466b8;}    
//SASS只需要定义一个基本颜色，其他可以通过函数获取
$main_color: #336699;
.main {color: $main_color;}
.lighten {color: lighten($main_color, 20%);}    
.saturate {color: saturate($main_color, 30%);}    
SASS的底层函数相当完整，如果会使用ruby的话，也可以自定义函数，完整列表在这里
{% endsh %}
## 导入(import)

在样式表过于复杂的时候，你可以将其按功能模块分割成不同的文件进行开发，SASS会将这些小文件统一编译成一个完整的CSS文件，与简单的包含多个文件不同，SASS的导入，是可以将变量，Mixin，等等一起导入的

{% sh [:css] %}
//_colors.scss(被导入的SASS文件，通常用_开头，它们在编译过程中不会生成CSS文件)
$main_color: #336699;
//application.scss 导入文件
//SASS会自动加上_去寻找文件
@import "colors";
#page {color: $main_color;}
{% endsh %}

## 扩展(extend)

@extend可以复制其他class或id的指定样式，让你无须再将逻辑上不相关的class放在一起，当然更不用复制粘贴了
{% sh [:css] %} 
//CSS
.blue_button, .checkout_button {background: #336699;}
.blue_button {color: white;}
.checkout_button {color: green;}
//SASS @extend
.blue_button {
    background: #336699;
    color: white;
}

.checkout_button {
    @extend .blue_button;
    color: green;
}{% endsh %}
## 混入(mixin)

Mixin可以说是SASS等CSS预处理语言最强大的要素了，简单来说，mixin可以将一部分样式抽出，作为单独定义的模块，被很多选择器重复使用。

### Mixin可以定义在单独文件中
{% sh [:css] %}
//_text.scss
@mixin blue_text {
    color: #336699;
    font-family: helvetica, arial, sans-serif;
    font-size: 20px;
    font-variant: small-caps; 
} {% endsh %}  
###导入并使用mixin
{% sh [:css] %}
@import "text";

.product_title {
    @include blue_text;
}
{% endsh %}
mixin与extend看似实现的功能差不多，但实际上除了语义上的不同外，mixin更为强大和复杂，因为她有参数(arguments)，参数还可以有默认值

##实现跨浏览器圆角

{% sh [:css] %}
//Cross browser Rounded borders mixin 
@mixin rounded_borders($color, $width: 5px, $rounding: 5px) {
    -moz-border-radius: $rounding $rounding;
    -webkit-border-radius: $rounding $rounding;
    -khtml-border-radius: $rounding $rounding;
    -o-border-radius: $rounding $rounding;
    border-radius: $rounding $rounding;
    border: $width $color solid; 
}

.header {
    @include rounded_borders(#336699, 3px);
}
{% endsh %}
实现跨浏览器透明度

{% sh [:css] %}
//Cross browser Opacity mixin
@mixin opacity($opacity) {
    filter: alpha(opacity=#{$opacity*100}); // IE 5-9+
    opacity: $opacity; 
}

.h1 {
    @include opacity(0.6);
}{% endsh %}
## 迭代(each)

在主流语言中，迭代属于循环实现的一种功能，例如ruby的each或者python的for in，sass使用@each实现
{% sh [:css] %}
/*CSS中要写很多同样的代码*/
.thom_picture {background-image: url("/image/thom.jpg");}
.jonny_picture {background-image: url("/image/jonny.jpg");}
.colin_picture {background-image: url("/image/colin.jpg");}
.phil_picture {background-image: url("/image/phil.jpg");}
//SASS使用@each变得非常简单
@each $member in thom, jonny, colin, phil {
    .#{$member}_picture {
        background-image: url("/image/#{$member}.jpg"); 
    } 
}
{% endsh %}
## 条件(condition)
 
说到编程基本控制流，除了循环就是条件了，sass中使用@if进行条件控制
{% sh [:css] %}
@mixin country_color($country) {
    @if $country == france {
        color: blue; 
    }
    @else {
        color: red; 
    } 
}

.england {
    @include country_color(england);
}
.france {
    @include country_color(france);
}
{% endsh %}

# Compass

以上SASS的基本要素都介绍的差不多了，不过对于在实践中使用SASS来说，强大的[Compass](http://compass-style.org/)是必不可少的，她由SASS的核心团队成员Chris Eppstein创建，是一个非常丰富的样式框架，包括大量定义好的mixin，函数，以及对SASS的扩展。

这里非常简要地介绍一些常用功能

## Reset

Compass提供一个基于大名鼎鼎的Eric Meyer的Reset CSS，我还没有和Twitter Bootstrap采用的Normalize.css一一比对过，不过compass reset的好处是可以分不同的模块reset
{% sh [:css] %}
//compass reset
//global reset
@import "compass/reset";

//partial reset 
@import "compass/reset/utilities";
{% endsh %}
##CSS3

前边提到的圆角和透明mixin实际上都在Compass中提供，当然还有几乎所有的css3相关模块，实际上有了Compass，不需要再写任何浏览器特定的代码了。
{% sh [:css] %}
//compass rounder corners
@import "compass/css3/border-radius";

.header {
    @include border-radius(4px); 
}

.header_top_left_rounded {
    @include border-top-left-radius(4px);
}
{% endsh %}
## Typography

Compass有很多基本mixin可以方便地定制各种表现层元素

比如水平列表，这个在顶部导航栏中相当常用
{% sh [:css] %}
//Compass
@import "compass/typography/lists/horizontal-list";

ul.horiz {
    @include horizontal-list(4px); 
}
{% endsh %}
我们看一眼在css中的对应实现多么复杂
{% sh [:css] %}
/*CSS实现*/
ul.horiz {
    margin: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
    *zoom: 1; 
}
ul.horiz li {
    list-style-image: none;
    list-style-type: none;
    margin-left: 0px;
    white-space: nowrap;
    display: inline;
    float: left;
    padding-left: 4px;
    padding-right: 4px; 
}
ul.horiz li:first-child, ul.horiz li.first {
    padding-left: 0; 
}
ul.horiz li:last-child {
    padding-right: 0; 
}
ul.horiz li.last {
    padding-right: 0; 
}
{% endsh %}
## Layout

Compass也提供一些影响布局的方法，比如将一个元素延展(Stretch)

HTML如下
{% sh [:css] %}
<div class="stretch_box">
    <div class="stretched>
        Stretched fully!
    </div>
</div>
//compass stretching
@import "compass/layout/stretching";

//stretched fully
.stretched {
    @include stretch; 
}

//stretched with gap
.stretched {
    @include stretch(12px, 12px, 12px, 12px); 
}

//stretched horizontally
.stretched {
    @include stretch-x; 
}

{% endsh %}
##Utilities

Compass还有很多实用功能模块，比如很烦人但在布局中经常要使用的clearfix，有了这个mixin，就不需要再定义一个clearfix的class，然后污染outer_box的html了

{% sh [:css] %}
//Compass clearfix
    @import "compass/utilities/general/clearfix";

    #outer_box {
        @include clearfix;
        width: 500px;
        #inner_box {
            float: left;
            width: 200px;
            height: 100px;
        }
    }

{% endsh %}
另外一个强大的功能是css sprites，原来我们经常用photoshop手动生成这张集合了所有小图标的大图片，修改和维护如同噩梦，现在有了compass，一切轻松了。
{% sh [:css] %}
//compass sprites
//combines all images in icon folder into one
@import "icon/*.png";
//"movie" is the origin icon's file name
.movie_icon {
    height: 20px;
    @include icon-sprite(movie); 
}
{% endsh %}
整篇介绍到这里就结束了，其实，无论是SASS这样的CSS预处理器，还是Compass这样的框架，要达成的目的都是一致的，那就是遵循DRY, 可读性, 和正交化的设计原则，让我们的生活变得更轻松快乐。

