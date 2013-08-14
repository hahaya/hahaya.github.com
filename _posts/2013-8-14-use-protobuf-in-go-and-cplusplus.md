---
layout: post
title: 使用protobuf进行go和c++程序的数据交换
summary: 最近在使用go和c++做一个小程序玩玩，由于涉及到数据交换，自己也不想去定义数据格式，于是就使用了goole protocol buffer(简称protobuf),protobuf使用起来很方便，但是在使用的过程中也遇到了一些问题，于是重新写了一个小程序模拟go和c++之间的通信，并记录下容易出问题的地方。其中c++写客户端，go用来写服务端，好了，那么开始吧~
categories: [go, c++]
tags: [go, c++]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 一、生成protobuf协议文件 ###
在开始写客户端和服务端之前，首先需要生成c++和go的protobuf协议文件，为了偷懒，我只写了一个proto文件，在终端下输入`vim chatmsg.proto`新建一个名为chatmsg的proto文件，并将其打开，输入如下内容：  

{%highlight protobuf%}
package chatmsg;

message Msg
{
    required int32 MsgId = 1;
    required string MsgInfo = 2;
    required string MsgFrom = 3;
}
{%endhighlight%}
  
Ps:该文件中消息类型Msg一定要大写，因为go的包中只有大写的方法和结构才能导出，在外部使用。  

1. 输入完成后，保存退出  
2. 在终端执行`protoc --cpp_out=. chatmsg.proto`生成c++的protobuf协议文件，将其拷贝到c++目录下  
3. 在终端下执行`protoc --go_out=. chatmsg.proto`生成go的protobuf协议文件，将其拷贝到go目录下  
4. 在go的protobuf协议文件目录下执行`go install`生成相应的包  

### 二、go服务端 ###
下面开始使用go写服务端，具体代码如下：  

{%highlight go%}
package main

import (
    "fmt"
    "os"
    "net"
    "code.google.com/p/goprotobuf/proto"
    "chatmsg"
)

func connHandle(conn net.Conn) {
    defer conn.Close()

    buff := make([]byte, 128)
    ReadLen, err := conn.Read(buff)
    if err != nil {
        fmt.Println("read data failed...")
        os.Exit(1)
    }
    fmt.Printf("read len: %d\n", ReadLen)
    fmt.Println(buff)

    //根据接收到的数据长度 取出真正的数据  否则比较是否符合规范会出错
    MsgBuf := buff[0 : ReadLen]

    ReciveMsg := &chatmsg.Msg {}
    //反序列化数据 并判断数据是否符合protobuf协议规范
    err = proto.Unmarshal(MsgBuf, ReciveMsg)
    if err != nil {
        fmt.Printf("unmarshaling error: ", ReciveMsg)
    }

    fmt.Printf("msg id: %d\n", ReciveMsg.GetMsgId())
    fmt.Printf("msg info: %s\n", ReciveMsg.GetMsgInfo())
    fmt.Printf("msg from id: %s\n", ReciveMsg.GetMsgFrom())
}

func main() {
    //获取TCP地址
    tcpAddr, err := net.ResolveTCPAddr("tcp4", ":2121")
    if err != nil {
        fmt.Println("get tcp addr failed...")
        os.Exit(1)
    }

    //开始监听
    listener, err := net.ListenTCP("tcp", tcpAddr)
    if err != nil {
        fmt.Println("listen tcp failed...")
        os.Exit(1)
    }

    //循环监听
    for {
        conn, err := listener.Accept()
        if err != nil {
            continue
        }

        //子goroutine中处理
        go connHandle(conn)
    }
}
{%endhighlight%}
  
Ps:在处理连接的goroutine中，最开始创建了128个byte接收数据，但是接收到的数据并没有填满128个byte，所以需要根据接收到的数据长度，取出真正接受到的数据内容，再来反序列化，否则会判断为不符合protobuf规范

### 二、c++客户端 ###
为了方便的演示，我将连接的服务端ip和端口port都固定写死了,而且没有做错误判断，因为重点是演示protobuf的数据交换，c++客户端代码如下：  

{%highlight c++%}
#include "chatmsg.pb.h"
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdio.h>
#include <cstring>
#include <iostream>
#include <string>
using namespace std;

int main(int argc, char *argv[]){
    //创建套接字
    int sk = socket(AF_INET, SOCK_STREAM, 0);

    //服务端地址
    struct sockaddr_in server;
    server.sin_family = AF_INET;
    server.sin_port = htons(2121);//固定端口port
    server.sin_addr.s_addr = inet_addr("127.0.0.1");//固定ip

    //连接服务器
    connect(sk, (struct sockaddr*)&server, sizeof(server));

    //使用protobuf序列化要发送的数据
    chatmsg::Msg sendMsg;
    sendMsg.set_msgid(0);
    sendMsg.set_msginfo("hello protobuf");
    sendMsg.set_msgfrom("hahaya");
    //序列化到string中
    string sendData;
    sendMsg.SerializeToString(&sendData);

    int len = sendData.length();
    //输出26
    cout << "string len:" << len << endl;

    char *buff = new char[len + 1];
    memcpy(buff, sendData.c_str(), len);
    //输出1
    cout << "buff len:" << strlen(buff) << endl;

    //向服务段发送数据
    //在发送数据时一定要指明数据长度 防止中间有\0截断c风格字符串
    send(sk, buff, len, 0);

    //关闭套接字
    close(sk);
    return 0;
}
{%endhighlight%}
  
Ps:通过程序中string len为26，而buff len为1，可以得出两者不相等，产生这个的原因是string中含有\0，而c风格字符串以\0结尾，所以在发送数据send时，一定要指定发送的长度(在Qt中，提供不指定长度发送的函数，这样发送数据只会发送\0前面的部分)。并且发送的数据长度一定要通过string类中的length求，而不能使用strlen得出长度。

### 四、结束 ###
程序已经写完了，启动服务端，然后启动客户端，如果看见服务端输出了MsgId、MsgInfo、MsgFrom的内容，那么恭喜你，使用protobuf进行go和c++程序的数据交换成功。
