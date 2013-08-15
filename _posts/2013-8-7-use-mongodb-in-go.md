---
layout: post
title: 使用go操作MongoDB数据库
summary: 以前接触过MongoDB数据库，但是没有实际使用过，趁学习go的过程，尝试下使用MongoDB，在此记录下使用过程，说不定以后还会用到。
categories: [go, mongodb]
tags: [go, mongodb]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 一、下载安装MongoDB ###
MongoDB是一个高性能，开源，无模式的文档型数据库，是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。他支持的数据结构非常松散，采用的是类似json的bjson格式来存储数据，因此可以存储比较复杂的数据类型。Mongo最大的特点是他支持的查询语言非常强大，其语法有点类似于面向对象的查询语言，几乎可以实现类似关系数据库单表查询的绝大部分功能，而且还支持对数据建立索引。  
进入MongoDB官网`http://www.mongodb.org/downloads`，下载适合自己电脑版本的MongoDB，下载完成后，解压文件。  
使用MongoDB前需要建立数据目录，默认的数据目录是/data/db。如果创建的是默认目录，需要确认该目录具有写权限。依次在终端下执行如下命令:  

        sudo mkdir -p /data/db  
        sudo chown -R hahaya:hahaya /data/db  

切换到解压后的MongoDB下，然后启动数据库(可以将bin目录添加到PATH中)，在终端下依次执行下列命令：  

        cd ~/mongodb-linux-i686-2.4.5  
        bin/mongod  

打开~/.profile文件，在文件内添加`export PATH=$PATH:/home/hahaya/mongodb-linux-i686-2.4.5/bin`，然后执行`source .profile`命令，那么下次就不需要切换到bin目录下启动数据库，直接在终端下执行`mongod`来启动数据库。  

### 二、安装mgo ###
目前go支持MongoDB最好的驱动就是mgo，这个驱动目前最有可能成为官方的pkg。mgo是MongoDB的一款强大的go语言驱动，支持集群，自动服务器磐机切换，灵活的序列化等功能。mgo官网地址:`http://labix.org/mgo`。安装mgo前需要先安装Bazaar，因为mgo是通过Bazaar来管理的，在终端下执行`sudo apt-get install bzr`安装Bazaar，安装mgo很简单，只需终端下执行`go get labix.org/v2/mgo`即可完成mgo的安装。  

### 三、使用go操作MongoDB ###
下面使用一个简单的例子来操作MongoDB，更加详细的使用方法可以参考mgo的官方文档(可在本地搭建go官网查看)。  

{%highlight go%}
package main

import (
    "fmt"
    "labix.org/v2/mgo"
    "labix.org/v2/mgo/bson"
    "os"
)

type Person struct {
    Name  string
    Phone string
}

func main() {
    // connect to MongoDB
    session, err := mgo.Dial("127.0.0.1")
    if err != nil {
            fmt.Println("connect MongoDB failed...")
            os.Exit(1)
    }
    // close MongoDB
    defer session.Close()
    // set MongoDB model
    session.SetMode(mgo.Monotonic, true)
    // connect DB and Collection in MongoDB
    conn := session.DB("test").C("people")
    // insert data into MongoDB
    err = conn.Insert(&Person{"hahaya", "123456"}, &Person{"sf", "111111"})
    if err != nil {
            fmt.Println("insert into MongoDB failed...")
            os.Exit(1)
    }
    result := Person{}
    //query MongoDB
    err = conn.Find(bson.M{"name": "hahaya"}).One(&result)
    if err != nil {
            fmt.Println("query MongoDB failed...")
            os.Exit(1)
    }
    // output the query result
    fmt.Println("phone", result.Phone)
}
{%endhighlight%}
