---
layout: post
title: Linux下安装QtCreator 5.10
summary: 最近QtCreator更新到版本5.10，已经支持Android开发，为了玩玩，就下载了最新版本的QtCreator 5.10，但是安装成功后遇到了两个问题，所以就记录下解决方法。
categories: [qt]
tags: [qt]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 下载安装 ###
1. 下载QtCreator 5.10，下载地址:[qt-project](http://qt-project.org/downloads)  
2. 依次执行下面的命令进行安装  

		cd software（下载QtCreator 5.10所在目录）
		chmod 0777 qt-linux-opensource-5.1.0-android-x86-offline.run 
		./qt-linux-opensource-5.1.0-android-x86-offline.run  
  
### 遇到的问题 ###
安装过程很简单，依次下一步下一步即可。安装过程没有遇到任何问题，以为这样就万事大吉了，所以新建了一个Qt Gui应用，修改工程目录，其他的使用默认配置即可。等QtCreator生成好文件后，直接运行，但是遇到了两个奇葩的问题  

1. 编译时，提示`Warning: File ../../Qt5.10/5.10/gcc/mkspecs/linux-g++/qmake.conf has modification time 4.4e+0.5 s in the future`，然后程序就一直编译i没有停止的迹象。然后感觉这个提示很奇怪，貌似与时间有关，在一看自己的系统时间还是6月份，而QtCreator 5.10在7月份才发布，所以猜测可能与时间有关，所以将系统的时间修改成正确时间后，再次编译，错误的提示消失。  

2. 虽然提示时间的错误消失，但是编译时又出现了另一个错误`cannot find -lGL`，这是由于缺少OpenGL库，所以需要先安装OpenGL库，在终端下执行`sudo apt-get install libgl1-mesa-dev`进行安装，安装好OpenGL库再次编译，终于看到了熟悉的窗口。问题解决完毕，成功~
