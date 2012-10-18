---
layout: post
title: "37signals 测试七忌"
date: 2012-10-17 22:37
comments: true
categories: Ruby-China
author: dotnil
---
转载自[Ruby-China](http://ruby-china.org/topics/2667)
据说今晚 Ruby Tuesday 杭州的话题是测试，可惜我最近都要忙项目。赶巧看到
37signals
也发博文聊测试（[http://37signals.com/svn/posts/3159-testing-like-the-tsa](http://37signals.com/svn/posts/3159-testing-like-the-tsa)），就顺便翻译一下它提的测试七忌。

-   不要以 100% 覆盖率为目标。
-   代码·测试比超过 1:2 就味道不对了，超过 1:3 则臭不可闻。
-   如果测试占用了你超过 1/3
    的时间，那你很可能就没搞对。如果超过一半时间，那你肯定弄糟了。
-   不要测试标准的 Active Record 的关联、验证或者 scope。
-   把集成测试留到对独立元素们做集成出现问题时在搞（也就是说，可以单元测试的，就不要做集成测试）。
-   不要用
    Cucumber，除非你生活在梦幻之城，那里的非程序员们要写测试（如果你在那儿，请务必给我寄一瓶仙境之沙）。
-   不要强迫自己对每个控制器、模型与视图都测试先行（我一般是 20%
    测试先行，80% 先上车后补票）

原文：

-   Don’t aim for 100% coverage.
-   Code-to-test ratios above 1:2 is a smell, above 1:3 is a stink.
-   You’re probably doing it wrong if testing is taking more than 1/3 of
    your time. You’re definitely doing it wrong if it’s taking up more
    than half.
-   Don’t test standard Active Record associations, validations, or
    scopes.
-   Reserve integration testing for issues arising from the integration
    of separate elements (aka don’t integration test things that can be
    unit tested instead).
-   Don’t use Cucumber unless you live in the magic kingdom of
    non-programmers-writing-tests (and send me a bottle of fairy dust if
    you’re there!)
-   Don’t force yourself to test-first every controller, model, and view
    (my ratio is typically 20% test-first, 80% test-after).\
