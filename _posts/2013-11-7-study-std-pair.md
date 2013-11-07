---
layout: post
title: std::pair源码学习
summary: 最近在学习STL，经常会使用到std::pair，于是想看看std::pair到底是个什么样神奇的东西，就跳到了std::pair的源码中，接下来就有了本文~
categories: [STL]
tags: [STL]
publish: true
---

# {{ page.title }} #
{{ page.summary }}

### std::pair的简单使用 ###
std::pair可以将两个值看做一个单元来处理。C++标准库中多处使用了std::pair，其中map和multimap就是使用std::pair来管理键/值(key/value)对的。任何函数如果返回两个值，都可以使用std::pair。下面的代码简单介绍如何std::pair  

{%highlight c++%}
#include <iostream>

int main(int argc, char *argv[])
{
    typedef std::pair<int, std::string> Student;

    //初始化pair的第一种方式 通过构造函数初始化
    Student stu_first(2011, "hahaya");

    //初始化pair的第二种方式 通过初始化成员变量初始化
    Student stu_second;
    stu_second.first = 2012;
    stu_second.second = "ToSmile";

    //初始化pair的第三种方式 通过辅助函数std::make_pair来初始化
    Student stu_third = std::make_pair(2013, "http://hahaya.github.com");

    //std::pair对象的输出
    std::cout << "number:" << stu_first.first << "\tname:" << stu_first.second << std::endl;
    std::cout << "number:" << stu_second.first << "\tname:" << stu_second.second << std::endl;
    std::cout << "number:" << stu_third.first << "\tname:" << stu_third.second << std::endl;

    return 0;
}
{%endhighlight%}

### std::pair的简单分析 ###
通过上面的例子，发现std::pair使用起来十分简单，接下来看看std::pair是如何定义的，SGI STL中的std::pair在文件stl_pair.h中定义，简化后的代码大概如下:    

{%highlight c++%}
namespace std {
    template<class _T1, class _T2>
    struct pair
    {
        typedef _T1 first_type;    //std::pair的第一个值类型的别名
        typedef _T2 second_type;   //std::pair的第二个值类型的别名

        _T1 first;                 //std::pair中保存的第一个值
        _T2 second;                //std::pair中保存的第二个值

        //构造函数
        pair():first(_T1()), second(_T2()) { }
        pair(const _T1& __a, const _T2& __b):first(__a), second(__b) {}
      
        //拷贝构造函数
        template<class _U1, class _U2>
        pair(const pair<_U1, _U2>& __p): first(__p.first),second(__p.second) { }

        //操作符重载
        //==操作符
        template<class _T1, class _T2>
        inline bool
        perator==(const pair<_T1, _T2>& __x, const pair<_T1, _T2>& __y)
        { return __x.first == __y.first && __x.second == __y.second; }

        //<操作符
        template<class _T1, class _T2>
        inline bool
        operator<(const pair<_T1, _T2>& __x, const pair<_T1, _T2>& __y)
        { return __x.first < __y.first
         || (!(__y.first < __x.first) && __x.second < __y.second); }

        //!=操作符(调用==操作符)
        template<class _T1, class _T2>
        inline bool
        operator!=(const pair<_T1, _T2>& __x, const pair<_T1, _T2>& __y)
        { return !(__x == __y); }

        //>操作符(调用<操作符)
        template<class _T1, class _T2>
        inline bool
        operator<=(const pair<_T1, _T2>& __x, const pair<_T1, _T2>& __y)
        { return !(__y < __x); }
     

        //<=操作符(调用<操作符)
       template<class _T1, class _T2>
        inline bool
        operator<=(const pair<_T1, _T2>& __x, const pair<_T1, _T2>& __y)
        { return !(__y < __x); }

        //>=操作符(调用<操作符)
        template<class _T1, class _T2>
        inline bool
        operator>=(const pair<_T1, _T2>& __x, const pair<_T1, _T2>& __y)
        { return !(__x < __y); }

        //std::make_pair辅助函数
        template<class _T1, class _T2>
        inline pair<_T1, _T2>
        make_pair(_T1 __x, _T2 __y)
        { return pair<_T1, _T2>(__x, __y); }
    };
}
{%endhighlight%}

通过上面的代码很容易发现：  
1. std::pair被定义成struct,而不是class，所以所有成员都是public，因此我们能直接存储std::pair中的值。  
2. 两个std::pair进行比较时，第一个元素具有较高的优先级。比如在判断两个std::pair是否相等时，如果两个std::pair的第一个元素不相等，其比较结果就成为整个比较行为的结果，如果第一个元素相等才继续比较第二个元素，并把比较结果当成整体比较结果。  
3. 操作符重载时可以先实现==和<操作符，其他的实现调用这两者即可。
4. template函数make_pair不需要你写出参数类型，就可以生成一个pair对象，但是使用make_pair时需要注意一个问题`std::make_pair(1, 22.01)`生成的pair第一个元素是int类型的，第二个元素是double类型的(因为无任何修饰词的浮点字面常量，其类型为double),如果要使std::pair的第二个元素的float类型的，则需要使用`std::make_pair(1, 22.01f)`。