---
layout: post
title: Ubuntu下开启ssh服务
description: Ubuntu下默认是没有开启ssh服务的，所以别的机器不能通过ssh协议连接该Ubuntu，下面介绍如何在Ubuntu下开启ssh服务。
category: blog
tags: Linux
publish: true
---

{{ page.description }}  
1 确定机器上是否已经安装ssh服务，在终端中执行`ps -e | grep ssh`，如果没有发现sshd服务，则表明该台机器没有安装ssh服务  
2 ssh分客户端(openssh-client)和服务端(openssh-server)  
3 Ubuntu默认安装了ssh客户端(如果没有安装则终端下执行`sudo apt-get install openssh-client进行安装`),安装了ssh客户端的机器则可以通过ssh协议连接到其他开启了ssh服务的机器  
4 如果想要别的机器能够登录到该Ubuntu，则需要安装ssh服务端，终端下执行`sudo apt-get install openssh-server`进行安装  
5 安装完成后再次执行`ps -e | grep ssh`查看ssh服务是否开启，如果没有开启则可以执行`sudo /etc/init.d/ssh start`或`sudo service ssh start`启动服务  
6 ssh服务的默认端口号是22，如果需要修改默认端口号，则需要修改ssh服务的配置文件`sudo vim /etc/ssh/sshd_config`中的`Port 22`这一行，将端口修改成任意其他端口(注意别和其他服务使用端口重复)  
7 修改完成后，保存退出，执行`sudo service ssh stop`和`sudo service ssh start`重启ssh服务  
8 其他电脑上使用`ssh hahaya@192.168.0.21`进行连接(其中hahaya为开启ssh服务的机器的用户名，192.168.0.21为其IP地址)，最后输入密码即可～  
