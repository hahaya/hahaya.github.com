---
layout: post
title: Linux下C++操作Redis
description: Redis是一个高性能的key-value数据库，Redis现在被用到越来越多的方面，那就有必要学一下了～
category: blog
tags: Redis
published: true
---

## 介绍 ##
Redis的全称是Remote Dictonary Server(远程字典服务器)，redis是由Salvatore Sanfilippo写的一个高性能key-value存储系统，Redis有如下优点:  
1. 高性能 - Redis能支持超过100K+每秒的读写频率  
2. 丰富的数据类型 - Redis支持Strings、Lists、Hashes、Sets及Ordered Sets等数据类型  
3. 原子性 - Redis的所有操作都是原子性的，同时Redis还支持对几个操作合并后的原子操作  
4. 丰富的特性 - Redis还支持发布/订阅、事务、key过期等特性  

## 安装Redis ##
打开Redis官网，进入下载页面，选择一个适合自己电脑的版本下载即可，下载飞机票[http://redis.io/download](http://redis.io/download),下载完成后解压、编译、安装，依次在终端下执行如下命令：  

        tar -zxvf redis-2.8.7.tar.gz  
        cd redis-2.8.7  
        sudo apt-get install tcl(redis测试程序需要tcl版本至少为8.5)  
        make 32bit(64位系统直接使用make即可)  
        sudo make install(将编译生成的可执行文件拷贝到/usr/local/bin目录下)  
        make test(用于确认安装正确与否)  

编译生成的可执行文件有:  
1. redis-server 	redis服务器  
2. redis-cli		redis客户端  
3. redis-benchmark 	redis性能测试工具  
4. redis-check-aof	aof文件修复工具  
5. redis-check-dump	rdb文件检查工具  
6. redis-sentinel	redis集群管理工具  

编译、安装完成后，在终端中输入`redis-server`以最简单的方式启动redis服务端，然后在另一个终端中输入`redis-cli`来连接redis服务端，接下来可以尝试各种命令了，可以在[http://try.redis.io](http://try.redis.io)预习下redis的各种命令，还可以在redis官网查看redis支持的命令。


## 安装hiredis ##
需要使用C/C++操作Redis，就需要安装C/C++ Redis Client Library,这里我使用的是hiredis，这是官方使用的库，而且用得人比较多，在终端下依次执行下列命令进行下载、安装：  

        git clone https://github.com/redis/hiredis  
        cd hiredis  
        make  
        sudo make install(复制生成的库到/usr/local/lib目录下)  
        sudo ldconfig /usr/local/lib  

## C/C++操作Redis ##
所有的准备工作已经做完了，接下来测试下如何使用C/C++操作Redis，代码如下：  

{%highlight c++%}
#include <hiredis/hiredis.h>
#include <iostream>
#include <string>

int main(int argc, char **argv)
{
    struct timeval timeout = {2, 0};    //2s的超时时间
    //redisContext是Redis操作对象
    redisContext *pRedisContext = (redisContext*)redisConnectWithTimeout("127.0.0.1", 6379, timeout);
    if ( (NULL == pRedisContext) || (pRedisContext->err) )
    {
        if (pRedisContext)
        {
            std::cout << "connect error:" << pRedisContext->errstr << std::endl;
        }
        else
        {
            std::cout << "connect error: can't allocate redis context." << std::endl;
        }
        return -1;
    }

    //redisReply是Redis命令回复对象 redis返回的信息保存在redisReply对象中
    redisReply *pRedisReply = (redisReply*)redisCommand(pRedisContext, "INFO");  //执行INFO命令
    std::cout << pRedisReply->str << std::endl;
    //当多条Redis命令使用同一个redisReply对象时 
    //每一次执行完Redis命令后需要清空redisReply 以免对下一次的Redis操作造成影响
    freeReplyObject(pRedisReply);   
    
    return 0;
}
{%endhighlight%}  
保存退出，执行`g++ OperatorRedis.cpp -o OperatorRedis -lhiredis`进行编译，编译完成后执行`./OperatorRedis`运行程序(在运行程序前需要启动redis服务端，否则会得到`connect error:Connection refused`这样的错误)，不出意外的话会看到输出的redis服务器信息～  
好了，C++操作Redis先进行到这里了，我这边封装了一个C++操作Redis的类，等完善后会放出来...  

## Redis学习链接 ##
1. [http://redis.io/](http://redis.io/):Redis官网  
2. [http://redis.cn/](http://redis.cn/):Redis中文官网  
3. [http://try.redis.io/](http://try.redis.io/):在线体验Redis  
4. [https://github.com/antirez/redis](https://github.com/antirez/redis):Redis开发版本源码  
5. [http://www.redisdoc.com/en/latest/](http://www.redisdoc.com/en/latest/):Redis命令参考  
6. [http://blog.nosqlfan.com/topics/redis](http://blog.nosqlfan.com/topics/redis):Redis系类文章  
7. [http://redisbook.readthedocs.org/en/latest/](http://redisbook.readthedocs.org/en/latest/):Redis设计与实现
8. [https://github.com/huangz1990/annotated_redis_source](https://github.com/huangz1990/annotated_redis_source):注释版Redis源码

