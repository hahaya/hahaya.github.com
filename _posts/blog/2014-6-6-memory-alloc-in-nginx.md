---
layout: post
title: Nginx --- 内存分配
description: 最近在学习Nginx的源码，很多位置都需要用到内存分配，故从Nginx的内存分配开始学习。
category: blog
tags: Nginx
published: true
---

## Nginx内存分配简介 ##
Nginx内存分配的源码主要位于${NGX_ROOT}/src/os/unix/ngx_alloc{.h|.c}文件中，Nginx提供ngx_alloc、ngx_calloc和ngx_memalign三个内存分配相关的函数，其中ngx_alloc和ngx_calloc是对系统malloc函数的封装，ngx_memalign在Linux系统下是对系统posix_memalign函数的封装，而在Solaris系统下是对系统memalign函数的封装，在其他系统下则是对ngx_alloc的define。既然Nginx提供了内存分配的函数，同样相应的也提供了内存释放的函数ngx_free，ngx_free仅仅是对系统函数free的define，因为malloc、posix_memalign、memalign分配的内存都是通过free函数释放的。  

## 源码分析 ##
`ngx_alloc.h`
{%highlight c%}

/*
 * Copyright (C) Igor Sysoev
 * Copyright (C) Nginx, Inc.
 */


#ifndef _NGX_ALLOC_H_INCLUDED_
#define _NGX_ALLOC_H_INCLUDED_


#include <ngx_config.h>
#include <ngx_core.h>


void *ngx_alloc(size_t size, ngx_log_t *log);   /* 分配内存 不进行初始化 */
void *ngx_calloc(size_t size, ngx_log_t *log);  /* 分配内存 并自动初始化内存空间为0 */

#define ngx_free          free                  /* 释放内存 */


/*
 * Linux has memalign() or posix_memalign()
 * Solaris has memalign()
 * FreeBSD 7.0 has posix_memalign(), besides, early version's malloc()
 * aligns allocations bigger than page size at the page boundary
 */

/*
 * 封装 posix_memalign，如果是 Solaris 则封装 memalign
 * 根据当前电脑配置自动生成NGX_HAVE_MEMALIGN NGX_HAVE_POSIX_MEMALIGN宏
 * 包含顺序为${NGX_ROOT}/src/core/ngx_config.h -> ${NGX_ROOT}/objs/ngx_auto_headers.h
 * ngx_auto_headers.h中判断操作系统的相关类型等 根据不同的系统包含不同的系统头文件
 * 测试机器为Linux 故接着通过ngx_config.h包含 ${NGX_ROOT}/src/os/unixngx_linux_config.h
 * 接着包含${NGX_ROOT}/objs/ngx_auto_config.h
 *
 * note:ngx_auto_headers.h和ngx_auto_config.h文件是在配置Nginx过程中生成的(./configure过程)
 */
#if (NGX_HAVE_POSIX_MEMALIGN || NGX_HAVE_MEMALIGN)

/*
 * 内存分配对齐
 */
void *ngx_memalign(size_t alignment, size_t size, ngx_log_t *log);

#else
/*
 * 其他系统下，如果不存在内存分配对齐函数memalign()或posix_memalign 则直接使用ngx_alloc代替
 */
#define ngx_memalign(alignment, size, log)  ngx_alloc(size, log)

#endif

/*
 * 声明三个外部使用的变量
 * 全局变量ngx_alloc.c中定义 ${NGX_ROOT}/src/os/unix/ngx_posix_init.c中初始化
 * 为了方便后面内存池等需要内存分配的地方使用而不用每次extern
 * 即避免每个需要使用的文件中extern这三个变量 故放在ngx_malloc.h中
 */
extern ngx_uint_t  ngx_pagesize;        /* 页大小 */
extern ngx_uint_t  ngx_pagesize_shift;  /* 页大小对应的移位数 */
extern ngx_uint_t  ngx_cacheline_size;  /* 缓存大小 */


#endif /* _NGX_ALLOC_H_INCLUDED_ */
{%endhighlight%}

`ngx_alloc.c`
{%highlight c%}  

/*
 * Copyright (C) Igor Sysoev
 * Copyright (C) Nginx, Inc.
 */


#include <ngx_config.h>
#include <ngx_core.h>

/* 三个变量的定义 */
ngx_uint_t  ngx_pagesize;
ngx_uint_t  ngx_pagesize_shift;
ngx_uint_t  ngx_cacheline_size;

/*
 * 分配内存 主要是对系统函数malloc的封装
 * 增加分配内存失败的判断机制 内存分配失败时写入日志文件
 */
void *
ngx_alloc(size_t size, ngx_log_t *log)
{
    void  *p;

    /* 调用malloc分配内存 */
    p = malloc(size);

    /* 分配内存失败 将错误信息写入日志文件 */
    if (p == NULL) {
        ngx_log_error(NGX_LOG_EMERG, log, ngx_errno,
                      "malloc(%uz) failed", size);
    }

    /* DEBUG模式下的处理 */
    ngx_log_debug2(NGX_LOG_DEBUG_ALLOC, log, 0, "malloc: %p:%uz", p, size);

    return p;
}

/*
 *  分配内存 并将分配的内存初始化为0
 *  封装ngx_alloc之后调用ngx_memzero初始化内存为0
 */
void *
ngx_calloc(size_t size, ngx_log_t *log)
{
    void  *p;

    //分配内存
    p = ngx_alloc(size, log);

    //内存初始化
    if (p) {
        ngx_memzero(p, size);
    }

    return p;
}


#if (NGX_HAVE_POSIX_MEMALIGN)
/*
 *  Linux系统下调用posix_memalign进行内存分配和内存对齐
 *
 */
void *
ngx_memalign(size_t alignment, size_t size, ngx_log_t *log)
{
    void  *p;
    int    err;

    /*
     * 背景：
     *      1）POSIX 1003.1d
     *      2）POSIX 标明了通过malloc( ), calloc( ), 和 realloc( ) 返回的地址对于任何的C类型来说都是对齐的
     * 功能：由posix_memalign分配的内存空间，需要由free释放。
     * 参数：
     *      p           分配好的内存空间的首地址
     *      alignment   对齐边界，Linux中，32位系统是8字节，64位系统是16字节
     *      size        指定分配size字节大小的内存
     * 要求：
     *      1）要求alignment是2的幂，并且是p指针大小的倍数
     *      2）要求size是alignment的倍数
     * 返回：
     *      0       成功
     *      EINVAL  参数不满足要求
     *      ENOMEM  内存分配失败
     * 注意：
     *      1）该函数不影响errno，只能通过返回值判
     *      2）在32位系统下malloc、calloc分配的内存是8字节为边界对齐的 即返回的内存地址起始值是8的倍数
     *      3）在64位系统下malloc、calloc分配的内存时16字节为边界对齐的 即返回的内存地址起始值是16的倍数
     *      4）有时候，对齐更大的边界，例如页面等，程序员需要动态的对齐，于是出现了posix_memalign函数
     *      5）posix_memalign函数分配内存返回的内存地址起始值是alignment的倍数
     */
    err = posix_memalign(&p, alignment, size);

    /* 内存分配失败 */
    if (err) {
        ngx_log_error(NGX_LOG_EMERG, log, err,
                      "posix_memalign(%uz, %uz) failed", alignment, size);:w

        p = NULL;
    }

    ngx_log_debug3(NGX_LOG_DEBUG_ALLOC, log, 0,
                   "posix_memalign: %p:%uz @%uz", p, size, alignment);

    return p;
}

#elif (NGX_HAVE_MEMALIGN)

/*
 * Solaris系统下调用memalign进行内存分配和内存对齐
 *
 */
void *
ngx_memalign(size_t alignment, size_t size, ngx_log_t *log)
{
    void  *p;

    p = memalign(alignment, size);
    /* 内存分配失败 */
    if (p == NULL) {
        ngx_log_error(NGX_LOG_EMERG, log, ngx_errno,
                      "memalign(%uz, %uz) failed", alignment, size);
    }

    ngx_log_debug3(NGX_LOG_DEBUG_ALLOC, log, 0,
                   "memalign: %p:%uz @%uz", p, size, alignment);

    return p;
}

#endif
{%endhighlight%}  

## 测试 ##
为了方便测试和学习Nginx的内存分配，以免引入过多的文件，没有使用Nginx中的文件包含机制，去掉了出现分配错误后写入日志文件的操作，并且只关注Linux系统，测试代码如下：  
`ngx_alloc.h`
{%highlight c%}  
#ifndef _NGX_ALLOC_H_INCLUDE_
#define _NGX_ALLOC_H_INCLUDE_

#include <stdio.h>
#include <stdlib.h>
#include <memory.h>

/* 分配内存 */
void *ngx_alloc(size_t size);
void *ngx_calloc(size_t size);
void *ngx_memalign(size_t alignment, size_t size);

/* 释放内存 */
#define ngx_free free

#endif
{%endhighlight%}  

`ngx_alloc.c`
{%highlight c%}  
#include "ngx_alloc.h"

void *ngx_alloc(size_t size)
{
    void *p;

    p = malloc(size);

    if (NULL == p) {
        printf("malloc %d memory failed.\n", (int)size);
    } else {
        printf("malloc %d memory success.\n", (int)size);
    }

    return p;
}

void *ngx_calloc(size_t size)
{
    void *p;

    p = ngx_alloc(size);

    if (p) {
        memset(p, 0, size);
    }

    return p;
}

void *ngx_memalign(size_t alignment, size_t size)
{
    void *p;
    int err;

    err = posix_memalign(&p, alignment, size);

    if (err) {
        printf("posix_memalign %d memory failed.\n", (int)size);
        p = NULL;
    } else {
        printf("posix_memalign %d memory success.\n", (int)size);
    }

    return p;
}
{%endhighlight%}  

`ngx_alloc_test.c`
{%highlight c%}  
#include "ngx_alloc.h"

int main()
{
    //ngx_alloc
    void *p_alloc = ngx_alloc(100);
    printf("p_alloc address:%X\n", p_alloc);
    ngx_free(p_alloc);

    //ngx_calloc
    char *p_calloc = (char*)ngx_calloc(100);
    printf("p_calloc address:%X\n", p_calloc);
    ngx_free(p_calloc);

    //ngx_memalign
    void *p_memalign = ngx_memalign(32, 1024);
    printf("p_memalign address:%X\n", p_memalign);
    ngx_free(p_memalign);

    return 0;
}
{%endhighlight%}  

`makefile`
{%highlight makefile%}  
cc = gcc
target = ngx_alloc_test
objs = ngx_alloc.o ngx_alloc_test.o

$(target):$(objs)
	$(cc) $(objs) -o $(target)

ngx_alloc.o:ngx_alloc.h ngx_alloc.c
	$(cc) -c -w ngx_alloc.c

ngx_alloc_test.o:ngx_alloc_test.c
	$(cc) -c -w ngx_alloc_test.c

clean:
	rm $(target) $(objs)
{%endhighlight%}  
