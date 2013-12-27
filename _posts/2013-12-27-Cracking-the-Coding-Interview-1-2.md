---
layout: post
title: Cracking the Coding Interview --- Q1.2
summary: 每天学习一点点，能坚持下来就是最大的胜利，开始今天的学习吧。
categories: [algorithm]
tags: [algorithm]
published: true
---

# {{page.title}} #
{{page.summary}}

### 一、题目 ###
原文：  
Write code to reverse a C-Style String. (C-String means that “abcd” is represented as five characters, including the null character.)  
译文：  
写代码写代码翻转一个C风格的字符串.(C风格意思是"abcd"需要用5个字符来表示，包括末尾的空字符)

### 二、解答 ###
**key point**:需要翻转的是一个C风格字符串，即以'\0'结尾的字符串。这道题比较简单，下面我分别使用指针和不使用指针实现两种方式实现。
##### 不使用指针实现 #####
这种方式的思想很简单，就是求出字符串的长度，然后头和尾交换，只用循环字符串的长度除以2次，代码实现如下：  

{%highlight c++%}
void reverse1(char *str)
{
    char temp;
    int len = strlen(str);
    for ( int i = 0; i < len/2; ++i )
    {
        temp = str[i];
        str[i] = str[len - i - 1];
        str[len - i - 1] = temp;
    }
}
{%endhighlight%}  

##### 使用指针实现 #####
这种方式的思想也比较简单，就是使用两个指针，一个指针指向字符串的开头，另一个指针指向字符串的末尾，然后依次交换即可，代码实现如下：  

{%highlight c++%}
void reverse2(char *str)
{
    if ( 0 == strlen(str) )
        return;

    char *p = str;

    while(*p)   //将p指针移动到字符串的'\0'字符上
        ++p;
    --p;        //将p指针移动到字符'\0'的前一个字符上

    char temp;
    while( str < p )  //移动后p的地址肯定大于q 以此做判断条件
    {
        temp = *str;
        *str = *p;
        *p = temp;

        str++;       //重新移动指针
        p--;
    }
}

{%endhighlight%}

### 三、总结 ###
这道题比较简单，需要注意的是C风格字符串以'\0'结尾，以及对指针的简单操作。

### 四、链接 ###
全书解题目录:  
[http://hahaya.github.io/2013/12/26/Cracking-the-Coding-Interview.html](http://hahaya.github.io/2013/12/26/Cracking-the-Coding-Interview.html)  
全书代码:  
[https://github.com/hahaya/Cracking_the_Coding_Interview](https://github.com/hahaya/Cracking_the_Coding_Interview)  
本题代码:  
[https://github.com/hahaya/Cracking_the_Coding_Interview/blob/master/code/1.2.](https://github.com/hahaya/Cracking_the_Coding_Interview/blob/master/code/1.2.)