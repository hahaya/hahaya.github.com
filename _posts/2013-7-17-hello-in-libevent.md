---
layout: post
title: 使用libevent输出Hello
summary: 我们在每一门新语言时，大部分教材上第一个程序可能就是输出经典的“Hello World”，当然我也不免俗，在学习libevnet时，第一个程序就编写输出Hello。那么目标都有了，就开始吧~
categories: [libevent, network]
tags: [libevnet, network]
published: true
---

# {{ page.title }} #
{{ page.summary }}  
libevent是一个开源的事件控制框架，如果不想陷入多线程或多进程的困扰,那么你可以尝试下使用libevent。libevent提供很多的API来管理和控制事件，可用于设计读、写、信号、定时等各种类型的事件处理。一个使用libevent的简单程序，只要分为以下几个步骤：  

		1. 初始化event_base结构体
		2. 初始化event结构体
		3. 添加事件
		4. 分发、运行事件

### 一、初始化event_base结构体 ###
在使用libevent时，首先需要初始化一个event_base结构体，因为它是libevnet的入口，初始化event_base很简单，使用如下方式  

		struct event_base *base = event_base_new();  
尽量使用新版本线程安全的event_base_new函数替代老版本的event_init函数，初始化event_base结构体后就建立了libevent的基本框架，接下来就是向框架注册事件和相应的事件回调函数了。

### 二、初始化event结构体 ###
设置事件使用event_set函数，函数原型为：  

		struct event *event_set (struct event_base *, evutil_socket_t, 
				short, event_callback_fn, void *);  

- event_base*：传入的的event_base结构体
- evutil_socket_t：监视事件对应的文件描述符
- short：指定事件类型，可以是EV_READ、EV_WRITE、EV_READ|EV_WRITE，经常配合EV_PERSIST使用，使事件执行后不被删除，直到调用event_del函数
- event_callback_fn：是编写好的回调函数指针,指明在监听事件发生时要做的处理
- void*：指定要传入回调函数中的附加参数

### 三、添加事件 ###
在事件初始化成功后，调用event_add函数添加事件，函数原型如下：  

		int event_add(struct event *ev, const struct timeval *timeout);  

- struct event *ev：要添加的事件
- const struct timeval *timeout：设置超时时间，没有用到可以设置成NULL

### 四、分发、运行事件 ###
前面三歩，已经完成event_base和event的初始化，并已经添加事件，最后一步就是调用event_base_dispatch函数分发、运行事件，函数原型如下：  

		int event_base_dispatch(struct event_base*);

### 五、简单示例代码 ###
{%highlight c%}
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <stdio.h>
#include <string.h>
#include <event.h>

//定义服务端口
#define PORT 1234
//定义监听连接请求的最大队列数
#define BACKLOG 5

//当有连接请求时会触发该函数
void on_accept(int sock, short event, void *arg)
{
	printf("Hello, Welcome to use libevent...\n");
}

int main(int argc, char *argv[]){
	
	//创建套接字
	int sock = socket(AF_INET, SOCK_STREAM, 0);
	//设置套接字属性 端口复用
	int optval = 1;
	setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(int));

	struct sockaddr_in addr;
	memset(&addr, 0, sizeof(sockaddr_in));
	addr.sin_family = AF_INET;
	addr.sin_port = htons(PORT);
	addr.sin_addr.s_addr = htonl(INADDR_ANY);

	//绑定
	bind(sock, (struct sockaddr*)&addr, sizeof(sockaddr_in));
	//监听
	listen(sock, BACKLOG);

	//获取一个event_base指针
	struct event_base *base = event_base_new();
	//获取一个event指针
	struct event *listen_event = event_new(base, sock, EV_READ|EV_PERSIST, on_accept, NULL);
	event_base_set(base, listen_event);
	//添加事件
	event_add(listen_event, NULL);
	//事件分发、运行
	event_base_dispatch(base);

	return 0;
}
{%endhighlight%}  

1. 在终端下执行`g++ main.c -o main -I/home/hahaya/libevent/include -L/home/hahaya/libevent/lib -levent`编译程序
2. 在终端下执行`./main`运行服务端程序
3. 在终端下使用命令`telnet 127.0.0.1 1234`连接服务端，连接成功会发现服务端不断输出`Hello, Welcome to use libevent...`
