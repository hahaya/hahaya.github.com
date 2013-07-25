---
layout: post
title: 联合union的妙用
summary: 之前只是知道有union这个东西，但是几乎没有使用过，最近在看libevent的源码，发现其中用到了union，就查了一些关于union的资料，发现union有很多妙用，就顺便记录在此。
categories: [c]
tags: [c]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 联合union ###
union和struct有一些相似之处，但是两者有本质上的不同。在struct中，每个成员有各自的内存空间，一个struct变量的总长度是各成员长度之和。而在union中，各成员共享一段内存空间，一个union变量的长度等于各成员中最长的长度。这里所谓的共享不是指多个成员同时装入一个联合变量中，而是只该union变量可以被赋予任一成员指，但是每次只能赋一种值，赋入新值则冲去旧值，下面使用一个例子说明：  

{%highlight c%}
#include <stdio.h>

union NUM{
    int a;
    int b;
};

/**
 * 定义一个名为DATA的union类型，它有两个成员变量：一个整形、一个char型数组
 * 这个DATA类型的union可以存放整形量no或存放char数组name
 */
union DATA{
    int no;
    char name[10];
};

int main(int argc, char **argv){
    NUM num;
    num.a = 1;


    //在32位机上，union所占空间为NUM中长度最长的变量所占空间 故为4
    printf("the size of union:%d\n", sizeof(num));
    //在union中各变量公用内存 所以a和b使用相当的内存 故对其中一个赋值
    //相当与对另一个赋值
    printf("the value of union a=%d, b=%d\n", num.a, num.b);

    return 0;
}
{%endhighlight%}

### 使用union让代码更加方便阅读 ###
假设需要一个3*3的数组，我们可以使用如下方法写：  

{%highlight c%}
#include <stdio.h>

struct Data{
    int a;

    /*
     * 联合中的结构体和数组共享内存，并且两者使用相同大小的内存，所以不会有空间浪费
     * 需要其中的某个元素时可以使用 data.float_num.f1来代替m.f[0][0]，
     * f[0][0]在使用起来不方便、直观，并且容易出错
     */
    union{
        struct{
            float f1, f2, f3, f4, f5, f6;
        };

        float f[3][3];
    }float_num;
};

int main(int argc, char **argv){
    struct Data data;
    data.float_num.f1 = 1.00;
    data.float_num.f2 = 2.00;
    data.float_num.f3 = 3.00;
    data.float_num.f4 = 4.00;
    data.float_num.f5 = 5.00;
    data.float_num.f6 = 6.00;

    printf("f[0][0]=%f\n", data.float_num.f1);
    
    return 0;
}
{%endhighlight%}

### 使用union节省内存 ###
假设有一个二叉树，根节点和中间节点不存放数据，只存放左右子节点指针，而叶子节点只存数据而没有子节点，我们有如下两种方法定义二叉树的节点  

{%highlight c%}
struct Node{
    struct Node *left_node;
    struct Node *right_node;
    float data;
};

union Node{
    struct{
        struct Node *left_node;
        struct Node *right_node;
    }pPointer;

    float data;
}
{%endhighlight%}  

在32位机器上，使用结构体时，需要的内存空间大小为：4 + 4 + 8 = 16，而使用联合union时，需要的内存空间大小为最大长度成员需要的内存空间大小，即为：8。由此可知，使用union能节省每个节点能节省一半的内存空间。在libevent中也有许多类似的用法。  

