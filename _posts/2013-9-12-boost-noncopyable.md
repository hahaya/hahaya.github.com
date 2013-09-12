---
layout: post
title: boost::noncopyable学习
summary: 在学习boost的时候，发现很多类都继承至boost::noncopyable，那么boost::noncopyable这个类是干什么用的呢？原来boost::noncopyable允许程序实现一个禁止复制的类，即不能使用类的复制构造函数和复制赋值操作符。以前在写程序的时候，经常反复实现一个不可复制的类或者单例类，于是经常性的拷贝、粘贴，不时还有一些小错误发生。现在boost::noncopyable能很轻松的帮你解决些问题，开始学习吧~
categories: [boost]
tags: [boost]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 一、原理 ###
相信大家在学习或者工作中自己也写过禁止复制的类，其实原理也很简单，下面就简单的介绍下。  
在C++中定义定义一个类时，如果不明确的自己定义复制构造函数和复制赋值操作符，编译器会默认自动生成这两个函数。请看如下代码：  

{%highlight cpp%}
//自定定义
class empty_class
{
    
};

//编译器自动生成后真实代码(省略了构造函数和析构函数)
class empty_class
{
    public:
    empty_class (const empty_class&){...}   //复制构造函数
    empty_class& operator= (const empty_class&){...}    //复制赋值操作符
};
{%endhighlight%}
  
一般情况下，编译器这种默认生成的行为是有用的，比如可以自动支持swap()、符合容器的复制语义、可以放入标准容器处理。但是在有些特殊情况下，我们不需要类的复制语义，其实这样的类实现起来也非常简单，只需要将复制构造函数和复制赋值操作符私有化，请看下面的例子：  

{%highlight cpp%}
class do_not_copy_class
{
    private:
    //私有化 声明即可 不用实现
    empty_class (const empty_class&);
    empty_class& operator= (const empty_class&);    
};
{%endhighlight%}
  
但是如果程序中有大量这样的类，重写这样的代码会让人失去耐心，而且代码出现次数越多越容易增大手写出错的几率。  

### 二、boost::noncopyable用法 ###
实现一个不可复制的类很简单，只需要从boost::noncopyable类继承即可，noncopyable位于名字空间boost，为了使用noncopyable组件，需要包含头文件`<boost/noncopyable>`或者`<boost/utility.hpp>`，其中`<boost/utility.hpp>`中包含数个小工具的实现，具体用法请看下面的程序：  

{%highlight cpp%}
#include <iostream>
#include <boost/noncopyable.hpp>

//这里使用默认的私有继承是可以的
//当然我也可以显示写出private或者publiic修饰词，但效果相同的
class do_not_copy_class : boost::noncopyable
{
};

int main(int argc, char *argv[])
{
    do_not_copy_class test1;
    //编译错误 调用复制构造函数
    do_not_copy_class test2(test1);
    do_not_copy_class test3;
    //编译错误 调用复制赋值操作符
    test3 = test1;
    
    return 0;
}

{%endhighlight%}
  
### 三、boost::noncopyable源码解析 ###
boost::noncopyable的实现原理很简单，代码很少，如下：  

{%highlight cpp%}
class noncopyable
{
    protected:
        //默认的构造函数和析构函数是保护的
        noncopyable() {}
        ~noncopyable() {}
    private:
        //私有化复制构造函数和复制赋值操作符
        noncopyable( const noncopyable& );
        const noncopyable& operator=( const noncopyable& );
};
{%endhighlight%}
  
从上面的代码中可以看出，当我们自定义类是boost::noncopyable的子类时，可以在子类中调用boost::noncopyable的构造函数和析构函数，从而完成子类的初始化和析构，但是外面的程序不能调用boost::noncopyable的构造函数和析构函数。子类会继承父类boost::noncopyable的复制构造函数和复制赋值操作符并将其私有化，从而禁止用户从外部访问复制构造函数和复制赋值操作符。  
如果使用C++11标准中的defalut(告诉编译器产生一个默认的)和delete(告诉编译器不自动产生)关键字，我们可以将boost::noncopyable的实现改为如下更清晰的形式：  

{%highlight cpp%}
class noncopyable
{
protected:
    //默认的构造函数和析构函数是保护的
    //使用编译器的自动产生的默认实现
    noncopyable() = default;
    ~noncopyable() = default;

    //使用delete关键字禁止编译器自动产生复制构造函数和复制赋值操作符
    noncopyable( const noncopyable& ) = delete;
    const noncopyable& operator=( const noncopyable& ) = delete;
};
{%endhighlight%}
