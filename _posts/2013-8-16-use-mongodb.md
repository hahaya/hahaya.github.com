---
layout: post
title: MongoDB数据库简单使用
summary: NoSQL现在越来越火，也许不久后的将来会用的NoSQL，而现在MongoDB比较出名，那么就简单学下MongoDB。MongoDB是面向文档的数据库，不是关系型数据库。MongoDB是一个强大、灵活的、可扩展的数据储存方式。它扩展了关系型数据库的众多功能，如辅助索引、范围查询和排序。MongoDB的功能非常丰富，比如内置的对MapReduce式聚合的支持，以及对地理空间索引的支持。
categories: [mongodb]
tags: [mongodb]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 1 基本概念 ###
MongoDB属于NoSQL数据库中的一种，很传统的SQL关系型数据库有很大的区别，在正式使用MongoDB之前，先介绍几个重要的概念。  

##### 1.1 文档 #####
文档是MongoDB的核心概念，是MongoDB中的基本单元，非常类似于关系型数据库中的行(但是比行要复杂)。多个键及其相关联的指有序的放在一起就是文档。下面的例子中演示了两个不同的文档(第一个文档只有一个键值对，第二个文档则有两个键值对)：  

        {"greeting" : "Hello,world."}  
        {"greeting" : "Hello,world.", "foo" : 3}  

这个例子中有许多需要注意的地方：  

- 文档中的键/值对是有序的，{"foo" : 3, "greeting" : "Hello,world"}和上面都是不同的文档。  
- 文档中的值不仅仅可以是双引号里面的字符串，还可以是其他MongoDB中的类型。上面例子中键"greeting"的值是一个字符串，而键"foo"的值是一个整数。  
- 键不能含有\0（空字符），这个字符表示键的结尾。  
- .和$这两个符号有特别的含义，只有特定环境下使用，通常来说就是被保留了。  
- 以下划线_开头的键是保留的。  
- MongoDB不仅区分类型({"foo" : 3}和{"foo" : "3"}是不同的)，还区分大小写({"foo" : 3}和{"Foo" : 3}是不同的)。  
- MongoDB的文档不能有重复的键，{"hahaya" : "me", "hahaya" : 123}是不合法的文档。  

##### 1.2 集合 #####
集合就是一组文档。如果说MongoDB中的文档类似于关系型数据库中的行，那么集合就类似于表。  
集合是无模式的，也就是说一个集合里面的文档可以是各式各样的，而关系型数据库中的行必须是一致的。比如说：在MongoDB中，{"greeting" : "hello, world."}和{"foo" : 3}就可以存在一个集合中。

##### 1.3 数据库 #####
MongoDB中多个文档组成集合，同样多个集合可以组成数据库。一个MongoDB实例可以承载多个数据库，多个数据库之间是完全独立的，每个数据库都有独立的权限控制，即使是在磁盘上，不同的数据库也放置在不同的文件夹中。  
有一些数据库名是保留的，可以直接访问这些有特殊作用的数据库。这些数据库如下：  

- admin：从权限的角度来看，这是"root"数据库，要是将一个用户添加到这个数据库中，则这个用户自动继承所有数据库的权限。一些特殊的命令端命令只能从这个数据库启动，比如列出所有的数据库或者关闭服务器。  
- local：这个数据库永远不会被复制，可以用来存储于本地单台服务器的任意集合。  
- config：当MongoDB用于分片设置时，config数据库在内部使用，用于保存分片的相关信息。  

### 2 安装MongoDB ###
进入MongoDB官网`http://www.mongodb.org/downloads`，下载适合自己电脑版本的MongoDB，下载完成后，解压文件。  
使用MongoDB前需要建立数据目录，默认的数据目录是/data/db。如果创建的是默认目录，需要确认该目录具有写权限。依次在终端下执行如下命令:  

        sudo mkdir -p /data/db  
        sudo chown -R hahaya:hahaya /data/db  

切换到解压后的MongoDB下，然后启动数据库(可以将bin目录添加到PATH中)，在终端下依次执行下列命令：  

        cd ~/mongodb-linux-i686-2.4.5  
        bin/mongod  

打开~/.profile文件，在文件内添加`export PATH=$PATH:/home/hahaya/mongodb-linux-i686-2.4.5/bin`，然后执行`source .profile`命令，那么下次就不需要切换到bin目录下启动数据库，直接在终端下执行`mongod`来启动数据库服务端。  

### 3 启动MongoDB服务器 ###
MongoDB一般作为网络服务器来运行，客户端可以连接到该服务器并执行操作。添加了MongoDB的环境变量后，只需在终端下输入`mongod`即可启动该服务器。  
mongod在没有参数的情况下会使用默认数据目录/data/db，并使用27017端口。如果/data/db目录不存在，服务器会启动失败。所以在启动MongoDB之前，创建数据目录，并使该目录具有写的的权限。如果端口被占用，启动也会失败,这通常是因为MongoDB实例已经在运行。  
启动MongoDB服务器后，服务器会打印版本信息和系统信息，然后等待连接。默认情况下，MongoDB会监听27017端口。mongod还会启动一个非常基本的HTTP服务器，监听端口比主端口高1000，也就是28017端口。直接在浏览器下输入`http://localhost:28017`就可以打开一个页面，获得数据库的管理信息。  

### 4 启动MongoDB客户端 ###
MongoDB自带一个JavaScript shell，可以在里面运行JavaScript程序，可以从命令行与MongoDB实例交互，这就是MongoDB的客户端。在终端下执行`mongo`启动MongoDB客户端，并自动连接到MongoDB服务器的test数据库。下面是一个使用mongo的简单示例：  

        $ mongo         (连接MongoDB服务器)  
        > db            (查看当前连接的数据库名称)  
        test  
        > use hahaya    (切换到hahaya数据库，只有当hahaya数据库中有集合时该数据库才创建)  
        switched to db hahaya  

### 5 简单的增删改查 ###
在MongoDB客户端中查看操作数据时会用到4个基本操作：创建、读取、更新和删除。下面依次介绍。  

集合的insert函数添加一个文档到集合里，而文档有键值对组成，在增加数据时，我们可以创建一个局部变量保存文档，然后再使用insert函数插入，下面是一个简单示例：  

        > post = {"title" : "use mongodb", "author" : "hahaya"}  
        {  "title" : "use mongodb", "author" : "hahaya" }  
        > db.blog.insert(post)  

上面已经增加了一个数据到blog这个集合中，调用集合的find或者findOne来查看集合中的文档：  

        > db.blog.find()  
        {  
            "_id" : ObjectId("520cf4a786523afbdda49e3f"),  
            "title" : "use mongodb",  
            "author" : "hahaya"  
        }  

前面已经成功插入数据到MongoDB数据库中，并且能进行查询，当我们想修改时就需要哟功能到集合的update函数了，update函数接受至少两个参数，第一个参数是要更新文档的限制条件，第二个是新的文档。假设现在要给先前的post文档增加时间，则需要新增加一个键，具体操作如下：  

        > post.date = "2013-8-16"  
        2013-8-16  
        > db.blog.update({"title" : "use mongodb"}, post)  
        > db.blog.findOne()  
        {  
            "_id" : ObjectId("520cf4a786523afbdda49e3f"),  
            "title" : "use mongodb",  
            "author" : "hahaya",  
            "date" : "2013-8-16"  
        }  


好了，那我们该如何删除集合中的文档呢？这就要用到集合的remove函数，remove用来从数据库中永久性的删除文档。remove在不使用参数调用时，它会删除一个集合中的所有文档，当然也可以接受一个参数指定限制条件，下面是简单的使用：  

        > db.blog.remove({"title" : "use mongodb"})  
        > db.blog.find()  

### 6 查看帮助 ####
由于mongo是一个JavaScript shell，通过在线查看JavaScript的文档能获得很多帮助。shell本身就内置了帮助文档，在shell中执行`help`命令可以查看MongoDB操作的帮助文档，非常方便。  
使用`db.help()`可以查看数据库级别的帮助。  
使用`db.foo.help()`可以集合的相关帮助。  
如果要了解某个函数的具体实现，比如参数、参数顺序等，就在输入的时候不要括号，使用`db.foo.update`来察看update函数的源码。  
