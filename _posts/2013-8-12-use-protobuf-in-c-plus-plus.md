---
layout: post
title: C++使用protobuf(Linux下)
summary: 很久之前就听过protobuf，但是一直没有使用过，最近在做一个小东西，涉及到C++和go的数据交换，就想到了使用protobuf，由于没有使用过，所以就先需要一些小小的试验，接下来就有了本文。
categories: [c++]
tags: [c++]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 一、protobuf简介 ###
protobuf全称为google protocol buffer，是google内部使用的一种数据交换格式，后来开源出来了。protobuf是一种语言无关、平台无关、扩展性好的用于通信协议、数据存储的结构化数据串行化方法。很像XML、JSON等，不过它更小、更快、也更简单。你可以定义自己的数据结构，然后使用代码生成器生成的代码来读写这个数据结构。

### 二、下载安装protobuf ###
要想使用protobuf，得先进行安装，在[http://code.google.com/p/protobuf/downloads/list](http://code.google.com/p/protobuf/downloads/list)下载protobuf源码包protobuf-2.5.0.tar.gz，在终端下依次执行如下命令进行protobuf的安装：  

        tar -zxvf protocol-2.5.0.tar.gz  
        cd protobuf-2.5.0  
        ./configure  
        make  
        make check  
        sudo make install  

安装完成后在终端下执行`vim ~/.profile`打开配置文件，在该文件中添加`export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib`，然后保存退出，接下来执行`source ~/.profile`是配置文件修改生效，最后执行`protoc --version`查看protobuf版本以测试是否安装成功  


### 三、生成protobuf协议文件 ###
执行命令`vim msg.proto`新建一个名为msg.proto的文件，并将其打开，在msg.proto中输入如下内容：  

{%highlight protobuf%}
package demo;

message msg
{
    required int32 MsgType = 1;     //必选字段
    required string MsgInfo = 2;    //必选字段
    required string MsgFrom = 3;    //必选字段
    optional string opt = 4;        //可选字段
}
{%endhighlight%}
  
输入完成后，保存退出，在终端下执行`protoc --cpp_out=. msg.proto`生成对应的msg.pb.h和msg.pb.cpp文件

### 四、在C++中使用protobuf ###
执行命令`vim protobuf_test.cc`新建一个名为protobuf_test.cc的C++源文件，并将其打开，在其中输入如下内容：  

{%highlight c++%}
#include "msg.pb.h"
#include <iostream>
#include <string>
using namespace std;

int main(int argc, char *argv[]){
    demo::msg msg_test;
    msg_test.set_msgtype(1);
    msg_test.set_msginfo("I am hahaya");
    msg_test.set_msgfrom("127.0.0.1");

    //将信息格式化到字符串中（写操作）
    string in_data;
    msg_test.SerializeToString(&in_data);
    cout << "format:" << in_data << endl;

    //将信息从字符串中反格式化出来（读操作）
    demo::msg msg_encoding;
    msg_encoding.ParseFromString(in_data);
    cout << "msg type:" << msg_encoding.msgtype() << endl;
    cout << "msg info:" << msg_encoding.msginfo() << endl;
    cout << "msg from:" << msg_encoding.msgfrom() << endl;
    return 0;
}
{%endhighlight%}
  
输入完成后，保存退出，在终端下执行`g++ protobuff_test.cc msg.pb.cc -o main -lprotobuf`命令进行编译，编译成功后执行`./main`运行。  
数据交换使用protobuf真方便，google的东西真心靠谱，更多关于protobuf的使用请在官网[http://code.google.com/p/protobuf/](http://code.google.com/p/protobuf/)上查看~

