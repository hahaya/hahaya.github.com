---
layout: post
title: 新建linux cocos2d-x项目
summary: 前面已经介绍过在linux下如何新建cocos2d-x android项目，现在主要来说下如何新建cocos2d-x linux项目。
categories: [cocos2d-x]
tags: [cocos2d-x]
published: true
---

# {{ page.title }} #
{{ page.summary }}  
cocos2d-x没有提供创建linux项目的模板，那么我们该怎么办了，其实很简单，我们只要拷贝cocos2d-x中自带HelloCpp项目(放在HelloCpp同级目录中)，然后给项目改名，最后删除项目中的其他没有的文件，最后项目目录如下所示：  

        TestDemo/  
        |---Classes  
        |---|---AppDelegate.h  
        |---|---AppDelegate.cpp  
        |---|---AppMacros.h  
        |---|---HelloWorldScene.h  
        |---|---HelloWorldScene.cpp  
        |---proj.linux  
        |---|---main.cpp  
        |---|---Makefile  
        |---Resources  

当我们新添加了文件时就需要在Makefile文件的SOURCES中包含文件路径，同理，当我们要添加库时，对应的就需要修改SHAREDLIBS和COCOS_LIBS。  
那么我们的项目如何编译呢？其实也很简单，只需要切换到proj.linux下去，然后执行make命令即可~  
