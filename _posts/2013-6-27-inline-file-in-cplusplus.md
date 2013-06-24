---
layout: post
title: C++中inl文件的妙用 
summary: 前两天在QQ群里聊天，才知道C++有inl文件，以前都没有听说过的，自己孤陋寡闻了，就学习了下，发现inl这个东西还是很有用的。
categories: [C++]
tags: [C++]
published: true
---

# {{page.title}} #
{{page.summary}}

### inl文件介绍 ###
inl文件是内联函数的源文件。内联函数通常在C++头文件中实现，但是当C++头文件中内联函数过多的情况下，我们想使头文件看起来简洁点，能不能像普通函数那样将内联函数声明和函数定义放在头文件和实现文件中呢？当然答案是肯定的，具体做法将是：将内联函数的具体实现放在inl文件中，然后在该头文件末尾使用`#include`引入该inl文件。  

由于编译器等不支持将模板函数、模板类等放单独分开编译，但是有了inl文件，我们可以把声明放在头文件中，然后将具体实现放在inl文件中。  

对于比较大的工程来说，出于管理方面的考虑，模板函数、模板类的声明一般放在一个或少数几个头文件中，然后将其定义部分放在inl文件中。这样可以让工程结构清晰、明了。  

在Google的C++代码编程规范中也说到了inl文件，需要阅读的同学可以从这里阅读Google的C++代码规范:[Google C++ Style Guide](http://google-styleguide.googlecode.com/svn/trunk/cppguide.xml)。  

### 简单示例 ###
{%highlight c++%}
//inl_demo.h
#ifndef _INL_DEMO_H_
#define _INL_DEMO_H_

template<typename T>
T return_max(T &T1, T &T2);

#include "inl_demo.inl"

#endif
{%endhighlight%}  

{%highlight c++%}
//inl_demo.inl
#ifndef _INL_DEMO_INL_
#define _INL_DEMO_INL_

#include "inl_demo.h"

template<typename T>
T return_max(T &T1, T &T2){
	return T1 > T2 ? T1 : T2;
}

#endif
{%endhighlight%}  

{%highlight c++%}
//main.cc
#include <iostream>
#include "inl_demo.h"
using namespace std;

int main(int argc, char *argv[]){
	int a = 10;
	int b = 20;
	cout << "The Max is ：" << return_max(a, b) << endl;
	return 0;
}
{%endhighlight%} 


