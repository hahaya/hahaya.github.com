---
layout: post
title: 使用C++11实现一个通用的单例类
summary: 以前在实现单例类时，实现多个类的单例可能面临一个问题：每次需要将类的构造函数、析构函数、复制构造函数和赋值操作符private标签中去，单有多个类时，这样重复操作比较麻烦且容易出错。有没有简单的方法避免这种操作呢？答案是肯定得，否则就不会有这篇文章了~
categories: [c++]
tags: [c++]
publish: true
---

# {{ page.title }} #
{{ page.summary }}  
在实现一个通用的单例类之前，先来做一些铺垫，比如：父类和子类(基类和派生类)之间的构造和析构函数调用先后顺序、C++11中的可变参数模板(因为各个类的构造函数参数不一样，导致不能做一个所有类型都通用的单例类，当然不带参数的通用单例类通过模板很容易实现)，下面开始介绍这些东西。

### 父类和之类之间的纠缠 ###
首先来看一个简单的例子，通过例子很容易发现父类和子类之间构造函数和析构函数的调用先后顺序：  

{%highlight c++%}
#include <iostream>

class Father
{
public:
    Father() { std::cout << "Father Constructor..." << std::endl; }
    virtual ~Father() { std::cout << "Father Destruction..." << std::endl; }
};

class Son : public Father
{
public:
    Son() { std::cout << "Son Constructor..." << std::endl; }
    ~Son() { std::cout << "Son Destruction..." << std::endl; }
};

int main(int argc, char **argv)
{
    Son *pSon = new Son();
    delete pSon;

    std::cout << std::endl;

    //指向之类的父类指针
    Father *pFather = new Son();
    delete pFather;

    return 0;
}
{%endhighlight%}  

程序输出为：

		Father Constructor...  
		Son Constructor...  
		Son Destruction...  
		Father Destruction...

		Father Constructor...  
		Son Constructor...  
		Son Destruction...  
		Father Destruction...

如果父类的析构函数不使用virtual的输出为：  

		Father Constructor...  
		Son Constructor...  
		Son Destruction...  
		Father Destruction...

		Father Constructor...  
		Son Constructor...  
		Father Destruction...  

从上面的输出中很容易发现：
1. 创建一个子类对象时，先调用父类的构造函数然后再调用子类的构造函数(可以理解成盖房子，父类为地基，需要先建，然后再建房子主体)  
2. 销毁一个子类对象时，先调用子类的析构函数然后在调用父类的析构函数(可以理解成拆房子，子类为房子主体，需要先拆，然后再拆地基)  
3. 如果需要创建、销毁一个指向子类的父类指针时(多态时会使用到)，一定需要将父类的析构函数声明为virtual。从上面的父类的析构函数不使用virtual的输出很容易发现，子类的析构函数并没有被调用，这是因为new出来的是子类Son的对象，采用一个父类Father的指针来接收，故在析构的时候，编译器因为只知道这个指针是父类的，所以只将父类部分的内存析构了，而不会去析构子类的内存，就造成了内存泄露。所以这种情况下，需要将父类的析构函数声明为virtual，这样才能正确的释放内存，从而避免造成内存泄露。  

看了上面的例子，接着看下面一个简单的例子：   

{%highlight c++%}
#include <iostream>

class Father
{
private:
    Father();
};

class Son : public Father
{
};

int main(int argc, char **argv)
{
    Son son;

    return 0;
}
{%endhighlight%}  

在编译的时候会发现编译根本就不能通过，提示为'Father::Father()' is private。从开始的例子中，可以看出创建一个子类时需要先调用父类的构造函数，但是父类的构造函数是private的，所以会调用失败，即使子类的构造函数是默认生成的public。

### 可变参数模板 ###
可变参数模板是在C++11中才引入的，如果需要使用可变参数模板则需要GCC版本不低于4.7或者使用VS2012及以上版本。