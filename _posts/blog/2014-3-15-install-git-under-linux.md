---
layout: post
title: Linux下安装git
description: 由于用git比较多，并且经常在不同的电脑上安装git，记忆力也不太好，经常忘记安装过程，而且网上的的东西比较杂，所以记录下安装过程备份一下。
category: blog
tags: Linux
published: true
---

0. 由于用git比较多，并且经常在不同的电脑上安装git，记忆力也不太好，经常忘记安装过程，而且网上的的东西比较杂，所以记录下安装过程备份一下。  
1. ubuntu下安装git很简单，使用包管理器即可，在终端下执行命令`sudo apt-get install git`  
2. 创建新的ssh key，终端下执行`ssh-keygen -t rsa -C "your_email@example.com"`，注意将邮箱地址替换成自己的邮箱地址  
3. 将新建的ssh key添加到ssh-agent中,在终端中执行`cd ~/.ssh && ssh-add id_rsa`,在安装过程中需要按几次Enter键  
4. 登录到[https://github.com](https://github.com)，点击右上角的Account settings -> SSH Keys，然后点击`Add SSH key`,在Title下给新加的ssh key命名，然后将`～/.ssh/id_rsa.pub`中的内容全部复制到Key输入框中，最后点击最下面的`Add Key`按钮即可  
5. 在终端中执行`ssh -T git@github.com`,如果看到`Hi hahaya! You've successfully authenticated, but GitHub does not provide shell access.`类似的字样，那么恭喜你，git安装并且配置成功，enjoy it～
