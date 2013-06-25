---
layout: post
title: 完美解决Ubuntu下运行程序提示error while loading shared libraries
summary: 最近在学习Boost.Asio，历经波折终于编译成功最简单的程序，但是运行时却出现，提示找不到libboost_system.so.1.53.0这个动态链接库。历经波折终于弄好，故将过程记录在此。
categories: [linux]
tags: [linux]
published: true
---

# {{page.title}} #
最近在学习Boost.Asio，历经波折终于编译成功最简单的程序，但是运行时却出现如下错误，提示找不到libboost_system.so.1.53.0这个动态链接库:  

![library_error](/images/library_error.png)  

最后无赖，只好求助于万能的网络，终于找到原因：Linux中与动态库连接的程序在运行时，需要将该动态库加载到内存中，Linux根据LD_LIBRARY_PATH查找动态库，默认的动态库文件目录为/usr/local/lib、/usr/lib。如果动态库没有位于默认目录中或环境变量设置错误，都会引起错误，提示为：`error while loading shared libraries: libxxx.xxx: cannot open shared object file: No such file or directory`  

竟然知道了错误的原因，那么解决起来也容易多了，只需要将动态库所在目录加入LD_LIBRARY_PATH中即可。  

		(1) 打开当前用户的配置文件 vim ~/.profile
		(2) 将动态库目录加入LD_LIBRARY_PATH中
		(3) 保存.profile，然后执行source ~/.profile生效
		(4) 重新运行程序，发现程序能成功运行  

![add_library](/images/add_library.png)  

注意：有时候不知道程序需要哪些库，可以使用ldd命令查看程序运行需要哪些库。
![ldd_command](/images/ldd_command.png)
