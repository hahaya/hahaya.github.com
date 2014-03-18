---
layout: post
title: ubuntu12.04下docker火速入门
description: Docker是一个云计算平台，它利用Linux的LXC、AUFU、Go语言、cgroup实现了资源的独立，可以很轻松的实现文件、资源、网络等隔离，其最终的目标是实现类似PaaS平台的应用隔离
category: linux
tags: blog
published: true
---

## 一 docker介绍 ##
Docker是一个云计算平台，它利用Linux的LXC、AUFU、Go语言、cgroup实现了资源的独立，可以很轻松的实现文件、资源、网络等隔离，其最终的目标是实现类似PaaS平台的应用隔离。简单来说docker是一个建立在LXC之上，基于进程的轻量级VM解决方案。拿现实中的货物的运输做对比，为了解决各种型号规格尺寸的货物在各种交通工具上进行运输的问题，于是人们发明了集装箱。dokcer的初衷也是为了将各种应用程序和他们所依赖的运行环境打包成标准的container/images，进而发布到不同的平台上运行。更多关于docker的介绍，请移步docker官网[https://www.docker.io/](https://www.docker.io/)~  

## 二 docker安装 ##
### 1 热身运动 ###
为了当安装完docker之后不知所措，不知道接下来该干什么，可以使用docker官网提供的交互式学习环境，在这里可以对docker有一个基本的了解，会学会使用几个基本的命令，国际惯例，提供飞机票[https://www.docker.io/gettingstarted/#](https://www.docker.io/gettingstarted/#)  

### 2 准备工作 ###
a) docker需要在64位系统上安装，所以首先需要确认自己系统是不是64位版本(docker目前只支持64位系统)，否则docker不能安装成功  
b) Ubuntu12.04 LTS上linux的内核版本3.2稍微有点老，而该版本上的LXC目前有些BUG，所以我们需要升级到3.8，依次在终端下执行如下命令：  

        sudo apt-get update  
        sudo apt-get install -y linux-image-generic-lts-raring  
        sudo apt-get install -y linux-headers-generic-lts-raring  
        sudo reboot  

### 3 开始安装docker ###
docker的安装也很简单，只需要先添加dokcer库的key，然后进行安装即可，依次在终端下执行如下命令：  

        sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9  
        sudo sh -c "echo deb http://get.docker.io/ubuntu docker main\  
        > /etc/apt/sources.list.d/docker.list"  
        sudo apt-get update  
        sudo apt-get install lxc-docker  

## 三 在docker中运行系统镜像 ##
现在已经安装好了docker了，但是我们使用`sudo docker images`没有发现任何可用的系统镜像，现在我们从docker repository中pull一个官方提供的一个很小的系统镜像，镜像名为busybox，后面会讲到如何自己制作系统镜像，直接在终端下运行`sudo docker pull busybox`进行下载镜像，下载完成后可以继续执行`sudo docker mages`查看可用的系统镜像。接着在终端中执行`sudo docker run busybox echo "hello world"`来运行显示`hello world`～  
由于我是在虚拟机中装的Ubuntu12.04 LTS系统，在运行时出现一个警告`WARNING: Local (127.0.0.1) DNS resolver found in resolv.conf and containers can't use it. Using default external servers : [8.8.8.8 8.8.4.4]`，提示很明显不能DNS不能使用127.0.0.1,否则在docker中不能联网，解决办法也很简单,打开`/etc/resolv.conf`文件，注释掉其中的`nameserver 127.0.0.1`，添加谷歌的DNS`nameserver 8.8.8.8`和`nameserver 8.8.4.4`这两行，保存退出即可生效。注意这个文件的修改在系统重启后会失效，所以下次系统后记得重新设置～  

## 四 制作docker系统镜像 ##
当然我们也可以自己制作docker系统镜像，制作镜像需要用到的工具是debootstrap，由于我平常用得多的是ubuntu系统，所以我就用网易163的源制作一个ubuntu13.04的镜像,在终端下依次执行  

        sudo apt-get install debootstrap(安装debootstrap)  
        sudo debootstrap raring ubuntu13.04 http://mirrors.163.com/ubuntu  
        (raring为ubuntu13.04系统的版本代号，ubuntu13.04为生成image的目录)  
        sudo chown -R hahaya ubuntu13.04(修改文件夹所属用户组)  
        tar -C ubuntu13.04/ -c . | sudo docker import - hahaya/ubuntu13.04(导入docker中)  
	sudo docker run hahaya/ubuntu13.04 echo "hello world"(使用echo命令显示hello world)  

PS:友情提供docker的安装脚本,可以[猛点这里](https://github.com/hahaya/program-study/tree/master/shell/docker)
