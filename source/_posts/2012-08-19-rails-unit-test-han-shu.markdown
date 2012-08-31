---
layout: post
title: "一些常用的Rails Unit Test 指令"
date: 2012-08-19 14:30
comments: true
categories: test
tags: ['rails','test','unit test']
author: tassandar
---

## 测试准备

首先我们要将测试数据准备好。参考这些 rake 命令就足够了。

<table>
	<tbody><tr>
		<th>Tasks                         </th>
		<th>Description</th>
	</tr>
	<tr>
		<td><tt>rake db:test:clone</tt>            </td>
		<td>Recreate the test database from the current environment’s database schema</td>
	</tr>
	<tr>
		<td><tt>rake db:test:clone_structure</tt>  </td>
		<td>Recreate the test database from the development structure</td>
	</tr>
	<tr>
		<td><tt>rake db:test:load</tt>             </td>
		<td>Recreate the test database from the current <tt>schema.rb</tt></td>
	</tr>
	<tr>
		<td><tt>rake db:test:prepare</tt>          </td>
		<td>Check for pending migrations and load the test schema</td>
	</tr>
	<tr>
		<td><tt>rake db:test:purge</tt>            </td>
		<td>Empty the test database.</td>
	</tr>
</tbody></table>


## 测试数据

把数据插入到 fixtures 下的 yml 文件中.

例如这样

    david:
     name: David Heinemeier Hansson
     birthday: 1979-10-15
     profession: Systems development
     
    steve:
     name: Steve Ross Kellock
     birthday: 1974-09-27
     profession: guy with keyboard

你甚至可以把 ruby 代码插入其中，像这样：
 
    <% earth_size = 20 %>
    mercury:
      size: <%= earth_size / 50 %>
      brightest_on: <%= 113.days.ago.to_s(:db) %>
     
    venus:
      size: <%= earth_size / 2 %>
      brightest_on: <%= 67.days.ago.to_s(:db) %>
     
    mars:
      size: <%= earth_size - 69 %>
      brightest_on: <%= 13.days.from_now.to_s(:db) %>

之后你就能够在测试中使用这些数据。
像这样：

`users(:david)`

使用数据了。

<!--more--> 

## 单元测试

通常要先进行的是单元测试。主要用到的断言函数如下：

<table>
	<tbody><tr>
		<th>Assertion                                                       </th>
		<th>Purpose</th>
	</tr>
	<tr>
		<td><tt>assert( boolean, [msg] )</tt>                                        </td>
		<td>Ensures that the object/expression is true.</td>
	</tr>
	<tr>
		<td><tt>assert_equal( obj1, obj2, [msg] )</tt>                               </td>
		<td>Ensures that <tt>obj1 == obj2</tt> is true.</td>
	</tr>
	<tr>
		<td><tt>assert_not_equal( obj1, obj2, [msg] )</tt>                           </td>
		<td>Ensures that <tt>obj1 == obj2</tt> is false.</td>
	</tr>
	<tr>
		<td><tt>assert_same( obj1, obj2, [msg] )</tt>                                </td>
		<td>Ensures that <tt>obj1.equal?(obj2)</tt> is true.</td>
	</tr>
	<tr>
		<td><tt>assert_not_same( obj1, obj2, [msg] )</tt>                            </td>
		<td>Ensures that <tt>obj1.equal?(obj2)</tt> is false.</td>
	</tr>
	<tr>
		<td><tt>assert_nil( obj, [msg] )</tt>                                        </td>
		<td>Ensures that <tt>obj.nil?</tt> is true.</td>
	</tr>
	<tr>
		<td><tt>assert_not_nil( obj, [msg] )</tt>                                    </td>
		<td>Ensures that <tt>obj.nil?</tt> is false.</td>
	</tr>
	<tr>
		<td><tt>assert_match( regexp, string, [msg] )</tt>                           </td>
		<td>Ensures that a string matches the regular expression.</td>
	</tr>
	<tr>
		<td><tt>assert_no_match( regexp, string, [msg] )</tt>                        </td>
		<td>Ensures that a string doesn’t match the regular expression.</td>
	</tr>
	<tr>
		<td><tt>assert_in_delta( expecting, actual, delta, [msg] )</tt>              </td>
		<td>Ensures that the numbers <tt>expecting</tt> and <tt>actual</tt> are within <tt>delta</tt> of each other.</td>
	</tr>
	<tr>
		<td><tt>assert_throws( symbol, [msg] ) { block }</tt>                        </td>
		<td>Ensures that the given block throws the symbol.</td>
	</tr>
	<tr>
		<td><tt>assert_raise( exception1, exception2, ... ) { block }</tt>           </td>
		<td>Ensures that the given block raises one of the given exceptions.</td>
	</tr>
	<tr>
		<td><tt>assert_nothing_raised( exception1, exception2, ... ) { block }</tt>  </td>
		<td>Ensures that the given block doesn’t raise one of the given exceptions.</td>
	</tr>
	<tr>
		<td><tt>assert_instance_of( class, obj, [msg] )</tt>                         </td>
		<td>Ensures that <tt>obj</tt> is of the <tt>class</tt> type.</td>
	</tr>
	<tr>
		<td><tt>assert_kind_of( class, obj, [msg] )</tt>                             </td>
		<td>Ensures that <tt>obj</tt> is or descends from <tt>class</tt>.</td>
	</tr>
	<tr>
		<td><tt>assert_respond_to( obj, symbol, [msg] )</tt>                         </td>
		<td>Ensures that <tt>obj</tt> has a method called <tt>symbol</tt>.</td>
	</tr>
	<tr>
		<td><tt>assert_operator( obj1, operator, obj2, [msg] )</tt>                  </td>
		<td>Ensures that <tt>obj1.operator(obj2)</tt> is true.</td>
	</tr>
	<tr>
		<td><tt>assert_send( array, [msg] )</tt>                                     </td>
		<td>Ensures that executing the method listed in <tt>array[1]</tt> on the object in <tt>array[0]</tt> with the parameters of <tt>array[2 and up]</tt> is true. This one is weird eh?</td>
	</tr>
	<tr>
		<td><tt>flunk( [msg] )</tt>                                                  </td>
		<td>Ensures failure. This is useful to explicitly mark a test that isn’t finished yet.</td>
	</tr>
</tbody></table>


## 控制器测试。

然后我们就要测试控制器了。

控制器中可以使用行为动词来模拟对网页的访问。

* get
* post
* put
* head
* delete

还可以使用以下四个函数来获取变量

assigns   获取应该在 view 中得到的变量
cookies   获取 cookies 
flash     获取flash
Session   获取session

具体你可以这样使用他们

flash["gordon"]               flash[:gordon]
session["shmession"]          session[:shmession]
cookies["are_good_for_u"]     cookies[:are_good_for_u]
assigns(:something)

还有三个直接可用的变量 

@controller 
@request 
@response 


还有一些 Rails 专用的断言：

<table>
	<tbody><tr>
		<th>Assertion                                                                        </th>
		<th>Purpose</th>
	</tr>
	<tr>
		<td><tt>assert_valid(record)</tt>                                                             </td>
		<td>Ensures that the passed record is valid by Active Record standards and returns any error messages if it is not.</td>
	</tr>
	<tr>
		<td><tt>assert_difference(expressions, difference = 1, message = nil) {...}</tt>              </td>
		<td>Test numeric difference between the return value of an expression as a result of what is evaluated in the yielded block.</td>
	</tr>
	<tr>
		<td><tt>assert_no_difference(expressions, message = nil, &amp;block)</tt>                     </td>
		<td>Asserts that the numeric result of evaluating an expression is not changed before and after invoking the passed in block.</td>
	</tr>
	<tr>
		<td><tt>assert_recognizes(expected_options, path, extras={}, message=nil)</tt>                </td>
		<td>Asserts that the routing of the given path was handled correctly and that the parsed options (given in the expected_options hash) match path. Basically, it asserts that Rails recognizes the route given by expected_options.</td>
	</tr>
	<tr>
		<td><tt>assert_generates(expected_path, options, defaults={}, extras = {}, message=nil)</tt>  </td>
		<td>Asserts that the provided options can be used to generate the provided path. This is the inverse of assert_recognizes. The extras parameter is used to tell the request the names and values of additional request parameters that would be in a query string. The message parameter allows you to specify a custom error message for assertion failures.</td>
	</tr>
	<tr>
		<td><tt>assert_response(type, message = nil)</tt>                                             </td>
		<td>Asserts that the response comes with a specific status code. You can specify <tt>:success</tt> to indicate 200,  <tt>:redirect</tt> to indicate 300-399, <tt>:missing</tt> to indicate 404, or <tt>:error</tt> to match the 500-599 range</td>
	</tr>
	<tr>
		<td><tt>assert_redirected_to(options = {}, message=nil)</tt>                                  </td>
		<td>Assert that the redirection options passed in match those of the redirect called in the latest action. This match can be partial, such that <tt>assert_redirected_to(:controller =&gt; "weblog")</tt> will also match the redirection of <tt>redirect_to(:controller =&gt; "weblog", :action =&gt; "show")</tt> and so on.</td>
	</tr>
	<tr>
		<td><tt>assert_template(expected = nil, message=nil)</tt>                                     </td>
		<td>Asserts that the request was rendered with the appropriate template file.</td>
	</tr>
</tbody></table>

靠他们基本就可以写出一份靠谱的测试拉。
