---
layout: post
title: go中使用protobuf
summary: 在前面的一篇文章中已经介绍了C++中如何使用protobuf，还介绍了一些protobuf的相关知识，这里就不再重复介绍了。由于自己要做的小程序要在c++和go之间做数据交换，所以需要尝试下go中如何使用protobuf，好了，废话不多说，come on...
categories: [go]
tags: [go]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 一、安装protobuf ###
要在go中使用protobuf，首先需要安装go版本的protobuf，安装过程十分简单，只需要在终端下执行`go get code.google.com/p/goprotobuf/{proto,protoc-gen-go}`进行proto和protoc-gen-go的安装，默认安装的目录是$GOBIN。  
Ps：由于自己电脑系统时间的问题，导致一直不能下载，最后修改系统时间就ok了。

### 二、生成protobuf协议文件 ###
执行命令vim msg.proto新建一个名为msg.proto的文件，并将其打开，在其中输入如下内容：  

{%highlight protobuf%}
package demo;

//go中导出结构体、方法必须大写
message Msg
{
    required int32 MsgType = 1;     //必选字段
    required string MsgInfo = 2;    //必选字段
    required string MsgFrom = 3;    //必选字段
}
{%endhighlight%}
  
输入完成后，保存退出，在终端下执行`protoc --go_out=. msg.proto`生成对应的msg.pb.go文件，在终端下切换到msg.pb.go所在目录，执行`go install`生成相应的包。

### 在go中使用protobuf ###
执行命令vim main.go新建一个名为main的go文件，并将其打开，在其中输入如下内容：  

{%highlight go%}
package main

import (
    "code.google.com/p/goprotobuf/proto"
    "demo"
    "fmt"
    "os"
)

func main() {
    //注意每条信息后面的,号
    msg_test := &demo.Msg{
        MsgType: proto.Int32(1),
        MsgInfo: proto.String("I am hahaya."),
        MsgFrom: proto.String("127.0.0.1"),
    }

    //将数据序列化到字符串中(写操作)
    in_data, err := proto.Marshal(msg_test)
    if err != nil {
        fmt.Println("Marshaling error: ", err)
        os.Exit(1)
    }

    //将数据从字符串中反序列化出来(读操作)
    msg_encoding := &demo.Msg{}
    err = proto.Unmarshal(in_data, msg_encoding)
    if err != nil {
        fmt.Println("Unmarshaling error: ", err)
        os.Exit(1)
    }

    fmt.Printf("msg type: %d\n", msg_encoding.GetMsgType())
    fmt.Printf("msg info: %s\n", msg_encoding.GetMsgInfo())
    fmt.Printf("msg from: %s\n", msg_encoding.GetMsgFrom())
}
{%endhighlight%}
  
输入完成后，保存退出，确保在msg.pb.go目录已经执行了`go install`，最后在终端下输入`go run main.go`看看效果吧~

