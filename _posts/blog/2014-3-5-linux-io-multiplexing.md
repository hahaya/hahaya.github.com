---
layout: post
title: Linux下的I/O复用
description: 在早期的网络编程中，服务端的处理方式为：当有客户端连接上来时，就为客户端创建一个单独的进程或线程，用于处理客户端请求。由于系统中能创建的进程或线程数有限并且只能监听一个socket，所以这种处理方式的性能并不是太高。那么有什么方式能提高服务端的性能呢？答案是---I/O复用。
category: blog
tags: NetWork
published: true
---


{{ page.description }}  
Linux下实现I/O复用的系统调用有：select、poll、epoll等(还有pselect等)，下面分别介绍～

## 一 I/O复用的意义 ##
I/O复用使程序能同时监听多个文件描述符(file descriptor),程序会在I/O复用系统调用处等待，直到被监视的文件描述符有一个或多个发生状态改变。在Linux下，文件描述符其实就是一个整数，我们比较熟悉的有0(标准输入stdin)、1(标准输出stdout)、2(标准错误输出stderr),其他的还有文件句柄FILE、套接字socket等。由于文章主要讨论网络相关的内容，所以文中文件描述符指的是socket套接字。

## 二 I/O复用的使用场景 ##
1. 程序需要同时处理多个socket连接  
2. 程序需要同时处理用户输入(文件描述符的值为0)和网络连接  
3. TCP服务器需要同时处理监听socket和连接socket  
4. 服务器需要同时处理TCP请求和UDP请求  
5. 服务器需要要同时监听多个端口或多个服务  

## 三 I/O复用的注意事项 ##
1. I/O虽然能同时监听多个文件描述符，但是它本身是阻塞的(在select、poll、epoll系统调用出阻塞，直到有监视的文件描述符发生状态变化，并不是阻塞在I/O系统调用)  
2. 当多个文件描述符同时就绪时，如果不采取额外的措施，程序就只能依次处理其中的每一个文件描述符，这使得服务器程序看起来是串行处理的。这时如果要实现并发，只有使用多进程或多线程等编程手段。  

## 四 socket文件描述符就绪条件
### 1 socket可读 ###
### 2 socket可写 ###
### 3 socket异常 ###

## 五 select系统调用 ##
### 1 作用 ###
在一段指定的时间内，监听用户感兴趣的文件描述符的可读、可写、异常事件

### 2 select函数介绍 ###
**select函数原型如下:**  

        int select(int nfds, fd_set *readfds, fd_set *writefds,  
                fd_set *exceptfds, struct timeval *timeout);

**select函数说明:**  
应用程序调用select函数时，通过readfds、writefds、exceptfds传入感兴趣的文件描述符，内核将修改它们来通知应用程序哪些文件描述符已经就绪。  
<br />
**select函数参数说明:**   
nfds: 被监听的文件描述符的总数，因为是用位记录要监听的文件描述符，比如需要监听文件描述符2,则表示要记录第2位，则会设置fd_set中的第2位,故最大值为2 + 1 =3，所以nfds通常设置为监听的所有文件描述符中的最大值加1，因为文件描述符、记录位是从0开始计数的。比如有a,b,c三个要监听的文件描述符，并且a的值最大,则nfds应该设置为a + 1  
readfds:     可读的文件描述符集合    
writefds：   可写的文件描述符集合    
exceptfds:   异常的文件描述符集合  
timeout:     设置select函数的超时时间  
<br />
**select返回值:**  
select函数成功时，返回就绪(可读、可写、异常)文件描述符的总数  
如果在超时时间timeout内没有任何文件描述符就绪，则select函数返回0
select函数失败时，返回-1，并设置errno  
如果在select函数等待期间，程序接收到信号，则select函数立即返回-1，并设置errno为EINTR  
<br />    
**fd_set说明:**  
fd_set结构体仅包含一个整形数组，该数组的每一个元素的每一位(bit)标记一个文件描述符，由于位操作过于麻烦，所以Linux中提供下面一组函数来操作fd_set:  

        void FD_ZERO(fd_set *set);		//清除set的所有位  
        void FD_SET(int fd, fd_set *set);	//设置set的第fd位  
        void FD_CLR(int fd, fd_set *set);	//清除set的第fd位  
        void FD_ISSET(int fd, fd_set *set);	//测试set的第fd为是否被设置  
<br />
**timeval说明:**

        struct timeval {  
            long    tv_sec;         // 秒    
            long    tv_usec;        // 微秒  
        };  
select函数的最后一个参数timeout是timeval类型的，用来设置select函数的超时时间，timeout是一个timeval类型的指针，所以内核能修改修改它，从而告诉应用程序select函数等待了多长时间，不过我们不能完全信任select函数调用后返回的timeout值，比如调用失败时,timeout的值是不确定的。  
通过timeval的定义，我们可以发现,select函数给我们提供了一个微秒级别的定时器。如果给timeout变量的tv_sec和tv_usec都设置成0，则select函数会立即返回。如果将timeout设置为NULL，则select函数将一直阻塞，直到某个文件描述符就绪。  

### 3 select函数使用示例 ###
{%highlight c%}
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdio.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <fcntl.h>
#include <stdlib.h>

int main( int argc, char **argv )
{
    //判断输入参数的合法性
    if ( argc <= 1 )
    {
        printf("usage: %s port\n", argv[0]);
        return -1;
    }

    int port = atoi(argv[1]);
    printf("listen at port:%d.\n", port);

    //服务端地址
    struct sockaddr_in server_addr;
    memset( &server_addr, 0, sizeof(server_addr) );
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(port);
    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);

    //创建套接字
    int server_fd = socket( AF_INET, SOCK_STREAM, 0 );
    if ( -1 == server_fd )
    {
        printf("create socket failed.\n");
        return -1;
    }

    //绑定套接字
    int ret = bind( server_fd, (struct sockaddr*)&server_addr, sizeof(server_addr) );
    if ( -1 == ret )
    {
        printf("bind failed.\n");
        return -1;
    }

    //监听
    ret = listen( server_fd, 5 );
    if ( -1 == ret )
    {
        printf("listen failed.\n");
        return -1;
    }

    //客户端地址
    struct sockaddr_in client_addr;
    memset( &client_addr, 0, sizeof(client_addr) );
    socklen_t client_addr_len = sizeof(client_addr);

    //接收客户端连接 为了方便此处只接收一个来自客户端的请求
    int talk_fd = accept( server_fd, (struct sockaddr*)&client_addr, &client_addr_len );
    if ( -1 == talk_fd )
    {
        printf("accept failed.\n");
        close( server_fd );
        return -1;
    }

    //接收信息缓冲区
    char buff[1204];
    memset( buff, 0, sizeof(buff) );


    fd_set read_fd;         //关注的可读文件描述符集合
    fd_set exception_fd;    //关注的异常文件描述符集合
    FD_ZERO( &read_fd );    //清空可读文件描述符集合的所有位
    FD_ZERO( &exception_fd );   //清空异常文件描述符集合的所有位

    while(1)
    {
        //清空信息缓冲区
        memset( buff, 0, sizeof(buff) );
        //每次调用select前需要重新设置文件描述符集合 因为事件发生之后文件描述符集合将被内核修改
        FD_SET( talk_fd, &read_fd );     //将客户端、服务端的socket描述符加入可读描述符集合
        FD_SET( talk_fd, &exception_fd );//将客户端、服务端的socket描述符加入异常描述符集合

        //阻塞在select调用 直到可读、异常描述符集合发生状态变化
        ret = select( talk_fd + 1, &read_fd, NULL, &exception_fd, NULL );
        if ( -1 == ret )
        {
            printf("select failed.\n");
            return -1;
        }
        
        //对于可读事件 采用普通的recv函数读取数据
        if ( FD_ISSET( talk_fd, &read_fd ) )
        {
            ret = recv( talk_fd, buff, sizeof(buff) - 1, 0 );
            
            if ( ret < 0 )
            {
                printf("recv read_fd failed.\n");
                break;
            }

            //输出接收到的普通数据
            printf( "get %d bytes of normal data: %s\n", ret, buff );
        }

        //对于异常事件 采用带MSG_OOB标志的recv函数接收数据
        if ( FD_ISSET( talk_fd, &exception_fd ) )
        {
            ret = recv( talk_fd, buff, sizeof(buff) - 1, MSG_OOB );
            if ( ret < 0 )
            {
                printf("recv exception_fd failed.\n");
                break;
            }

            //输出接收到的异常数据
            printf( "get %d bytes of oob data: %s\n", ret, buff );
        }
    }

    close( talk_fd );
    close( server_fd );
    return 0;
}
{%endhighlight%}  
编译完成后，可以尝试使用telnet连接该服务端，进行接下来的测试～




