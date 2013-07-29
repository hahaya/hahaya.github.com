---
layout: post
title: 查看go的帮助文档
summary: 刚刚开始学习go，进而接触到很多go中的函数，很多时候不知道函数该传什么参数，有什么返回值，这个时候就可以查看go的帮助文档了。
categories: [go]
tags: [go]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 通过godoc命令查看帮助文档 ###
go的文档可以通过godoc命令进行查看、阅读，它已经包含在go的发布包中  
1. 查看某个包的信息，比如查看fmt包的信息，只需在终端下输入`godoc fmt`即可查看fmt包的信息  
2. 查看某个包中的子包信息，比如查看net包下的http包，只需在终端下输入`godoc net/http`即可查看net/http包的信息  
3. 查看某个函数的信息，比如查看fmt包下的Printf函数，只需在终端下输入`godoc fmt Printf`即可查看Printf函数的信息  
4. 查看go所有的内建函数，只需在终端下输入`godoc builtin`即可  
5. 查看go中某个函数的源码，只需在终端下输入`godoc -src fmt Printf`即可

### 本地搭建go官网 ###
很多时候会发现go官网上不了，这时候该怎么办呢，其实我们可以很方便的在本地搭建一个go官网，只需要下面的两步：  
(1)在终端下执行`godoc -http=:8080`（后面的8080端口可以换成其它的任意没有被占用的端口）  
(2)在浏览器中输入`http://localhost:8080`即可看到本地搭建的go官网
