---
layout: post
title: Linux下安装、配置libevent
summary: 一直对服务端开发很感兴趣，但是一直没有开始看，而且经常听别人说起libevent，自己却一直没用过，今天在qq群里面聊天，有一哥们讲到自己学习服务端开发的学习经历，其中也提到了libevent，那哥们也对我提出的问题给了很好的回答，服务端开发有很多东西需要学习，那么就从libevent开始吧。
categories: [libevent, network]
tags: [libevent, network]
published: true
---

# {{page.title}} #
{{page.summary}}

### 一、关于libevent ###
libevent是一个事件触发、异步事件的网络库，是一个轻量级的开源高性能网络库，以BSD许可证发布，适用于Windows、Linux、BSD、Mac OS等多种平台，内部使用select、epoll等系统调用。libevent已经被广泛的应用，作为底层的网络库，比如memcached、Vomit、Nylon、Natchat等等。

### 二、libevent特点 ###
- 事件驱动、高性能  
- 轻量级，专注于网络，不如ACE那么庞大臃肿  
- 源码精炼、易读  
- 跨平台，支持Window、Linux、BSD、Mac OS  
- 支持多路复用技术，select、poll、epoll、kqueue等  
- 支持I/O、定时器、信号等事件  

### 三、libevent的跨平台 ###
在处理大量socket连接时，使用select模型并不高效，所以各个系统提供了处理大量socket连接的解决方案:  

- Linux下的epoll  
- BSD下的kqueue  
- Solaris下的evports  
- Window下的IOCP  

由于各个平台使用了不同的接口，那么我们需要在编写跨平台的高性能异步程序时就需要做一层封装。这个时候libevent就是一个较好的选择，其最底层API为各个平台实现高性能异步程序提供了一致的接口。  

### 四、Linux下安装配置libevent ###
在安装之前需要下载[libevent](http://libevent.org)，目前稳定版本是2.0.21，下载完成后，执行一下命令安装libevent  

		cd libevent(libevent下载后保存的目录)
		tar -zxvf libevent-2.0.21-stable.tar.gz
		cd libevent-2.0.21-stable
		./configure --prefix=/home/hahaya/libevent
		make
		make install  
编译完成后会在`/home/hahaya/libevent`目录下发现lib、include、bin三个目录，可以打开看看里面都有些什么东西。

### 五、libevent组成部分 ###
#### 1. libevent组件    

- evutil：用于抽象不同平台网络实现差异的通用功能  
- event和evelibeventnt_base：libevent的核心，为各种平台特定的、基于事件的非阻塞IO后端提供抽象API，让程序可以知道套接字何时已经准备好，可以读或者写，并且处理基本的超时功能，检测OS信号  
- bufferevent：为libevent基于事件的核心提供使用更方便的封装。除了通知程序套接字已经准备好读写之外，还让程序可以请求缓冲的读写操作，可以知道何时IO已经真正发生  
- evbuffer：在bufferevent层之下实现了缓冲功能，并且提供了方便有效的访问函数  
- evhttp：一个简单的HTTP客户端/服务端实现  
- evdns：一个简单的DNS客户端/服务端实现  
- evrps：一个简单的RPC实现

#### 2. libevent库 ####
安装配置好libevent后，在`/home/hahaya/libevent/lib`目录下，会默认生成下列库  

- libevent_core：所有核心的事件和缓冲功能，包含了所有的event_base、evbuffer、bufferevent和工具函数  
- libevent_extra：定义程序可能需要，也可能不需要的协议特定功能，包括HTTP、DNS、RPC  
- libevent：这个库因为历史原因而存在，它包含libevent_core和libevent_extra的内容。不应该使用这个库，未来版本阿的libevent可能会去掉这个库  
某些平台上可能会编译生成下列库  
- libevent_pthreads：添加基于pthread可移植线程库的线程和锁定实现。它独立于libevent_core，这样程序使用libevent时就不需要链接到pthread，除非是以多线程方式使用libevent  
- libevent_openssl：这个库为使用bufferevent和OpenSSL进行加密的信息提供支持。它独立于libevent_core，这样程序使用libevent时就不需要链接到OpenSSL，除非是进行加密通信  

#### 3. libevent头文件 ####
libevent头文件都安装在`/home/hahaya/libevent/include/event2`目录中，头文件分为三类：  

- API头文件：定义libevent公用接口，这类头文件没有特定后缀。  
- 兼容头文件：为已废弃的函数提供兼容的头部包含定义。不应该使用这类头文件，除非是在移植较老版本libevent程序时。  
- 结构头文件：这类头文件以相对不稳定的布局定义各种结构体。这些结构体中的一些是为了提供快速访问而暴露；一些是因为历史原因而暴露，直接依赖这类头文件中的任何结构体都会破坏程序对其他版本libevent的二进制兼容，有些是以非常难以调试的方式出现，这类头文件具有后缀_struct.h。  



好了，关于libevent安装和配置就介绍到这里，接下来会学习如何使用在自己的程序中使用libevent~
