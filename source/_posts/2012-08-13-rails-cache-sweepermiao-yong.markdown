---
layout: post
title: "rails cache sweeper妙用"
date: 2012-08-13 00:38
comments: true
categories: rails
tags: ['rails','sweeper','cache']
author: hooopo
---

转自 <http://hooopo.iteye.com/blog/769029>


webgame中的任务系统简单的描述就是这样的需求： 

1.一个角色身上携带各种任务（任务获得渠道很多，系统分配获得，主动接取获得等）

2.角色的任何操作都有可能完成身上携带的某个任务 

一个简单的种植小麦任务： 

这个任务过程是这样的：如果一个角色身上携带一个种植小麦的任务，当他在执行种植小麦的操作时，把种植小麦这个任务标记成完成状态。 

常规方式实现： 

{% sh [:ruby]%}
class PlantController < ApplicationController  
  def wheat  
    #此处省略种植操作....  
    if 种植小麦成功  
      task = current_role.tasks.find_by_tag("plant_wheat")  
      task.update_attributes :status => "completed" if task  
      render "plant ok"  
    else  
      render "plant fail"  
    end  
  end  
end  
{% endsh %}
这种方式简单，直观。 
但是随着任务的增多，操作的增加，本来就已经很复杂的业务逻辑里面再掺杂着这样的任务判定与更新逻辑在里面就很难维护了。 


幸好，rails有cache sweeper这东东。。！ 

cache sweeper本来的用途是集中处理缓存失效逻辑的，就像上面说的，缓存失效逻辑如果分散在各个action不便于管理和维护。。 

任务与缓存失效都有着这样一个共通点：缓存失效与任务触发都是由action的执行与model的更改造成的。 

监视action的执行rails里有各种filter 

监视model的改变rails里有observer 

但是这两个任意一个也解决不了上面的问题~ 

而cache sweeper正是把两者接合起来的一个东西： 


> Sweepers are the terminators of the caching world and responsible for expiring caches when model objects change. 
> They do this by being half-observers, half-filters and implementing callbacks for both roles.


利用cache sweeper的falf-ovserver half-filter的特性，完成上面需求： 

{% sh [:ruby]%}
#app/task_monitors/plant_contract_monitor.rb  
class PlantContractMonitor < ActionController::Caching::Sweeper  
  observe PlantContract  
      
  def after_save(record)  
    if current_role  
      if record.name == "小麦"  
        task = current_role.tasks.find_by_tag("plant_wheat")  
        task.update_attributes :status => "completed" if task  
      end  
    end  
  end  
end  
{%endsh%}

种植小麦action只需开头加一句： 

{% sh [:ruby]%}
cache_sweeper :plant_contract_monitor, :only => [:wheat]  

{%endsh%}
