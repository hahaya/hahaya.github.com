---
layout: post
title: Nginx源码分析 --- 编译、安装
description: 很久没怎么学习，也没有写博客了，真是罪过。一直听别人说Nginx代码清晰、完美，一直想膜拜下Nginx代码的，但是一直都没有开始。这是病，得治～
category: blog
tags: Nginx
published: true
---

## Nginx目录结构 ##
要学习Nginx源代码，首先得下载一份源代码，官方下载地址[http://nginx.org/en/download.html](http://nginx.org/en/download.html),这里我下载的Nginx版本为1.4.7，下载后解压，得到的目录结构如下:  

        |---auto    (执行./configure命令时，所依赖的一些自动脚本)  
        |---conf    (Nginx需要的配置文件模板)  
        |---contrib (存放一些实用工具)  
        |---html    (默认的网页访问文件存放目录)  
        |---man     (帮助文档)  
        |---src     (Nginx核心源代码目录)  
            |---core   (核心基础代码 Nginx服务的入口)  
            |---event  (事件处理逻辑的封装)  
            |---http   (HTTP协议处理模块 Nginx可作为WEB服务器和代理服务器运行时的核心模块)  
            |---mail   (Mail协议处理模块 Nginx作为pop3/imap/smtp代理服务器运行时的核心模块)  
            |---misc   (Nginx的一些utils 定义了test和profiler的一些外围模块的逻辑)  
            |---os     (Nginx对各个平台抽象逻辑的封装)  
        |---ojbs    (只有当configure命令执行成功时才会生成该目录 Nginx源码并没有这个目录 编译生成的目标文件存放目录)  
            |---autoconf.err       (保存configure命令执行过程中产生的结果)  
            |---ngx_auto_headers.h (保存了一些宏 会被src/core/ngx_config.h和src/os/unix/ngx_linux_config.h引用)  
            |---ngx_auto_config.h  (保存了一些宏 会被src/core/ngx_config.h和src/os/unix/ngx_linux_config.h引用)  
            |---Makefile           (编译Nginx工程 以及执行make install进行安装Nginx)  
            |---ngx_modules.c      (定义Nginx支持的模块以及模块的优先级)  
            |---src  
                |---core  
                |---event  
                    |---modules  
                |---os  
                    |---unix  
                    |---win32  
                |---http  
                    |---modules  
                        |---perl  
                |---mail  
                |---misc  

## 编译、安装 ##
由于我现在并并进行Nginx源码的调试，故我选择最方便的方式进行编译安装。Nginx的编译安装也很简单，只需要按照基本的配置、编译、安装三步即可，依次在终端下执行如下命令:  

        //配置 --prefix指定安装路径  
        ./configure --prefix=/home/hahaya/study/bin/nginx  
        
        //编译  
        make  
        
        //安装部署 安装到指定prefix的安装目录下  
        make install  

## Nginx简单使用 ##
Nginx的启动和停止也很简单, 切换到Nginx的安装目录，然后只需在终端下执行`sudo ./nginx`启动Nginx，在终端下执行`sudo ./nginx -s stop`停止Nginx

