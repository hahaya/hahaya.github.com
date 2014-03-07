---
layout: post
title: Facade外观模式(C++)
description: Facade模式是平常用得比较的一种模式了，即使没有听过外观模式，也可能在很多时候使用多了它，外观模式是依赖倒转原则和迪米特法则的完美体现。
category: blog
tags: 设计模式
published: true
---

{{ page.description }}  

## 一 意图 ##
外观模式(Facade),为子系统中的一组接口提供一个一致的界面，Facade模式定义了一个高层接口，这一接口使得子系统更加容易使用。

## 二 动机 ##
将复杂的逻辑封装起来，通过增加一个Facade对象对外公开简单的接口，这样客户端在调用时只需要知道Facade对象的接口，而不用去了解子系统中复杂的逻辑，下图很好的解释Facade外观模式的左右(下图中左边为没有使用外观模式，右边为使用外观模式,并且子系统client与client之间还可能有相互调用关系，为了简单，没有将cleint于client之间的相互调用关系表示出来)  
  
![facade_purpose](/images/blog-article-images/blog/facade_purpose.png)  

## 三 类图 ##
![facade_uml](/images/blog-article-images/blog/facade_uml.png) 
**Facade:**  
1. 知道哪些子系统类负责处理请求  
2. 将客户的请求代理给适当的子系统对象  
**Subsystem Classes:**  
1. 实现子系统的功能  
2. 处理由Facade对象指派的任务  
3. 没有Facade对象的任何相关信息，即没有Facade对象的指针或引用  

## 四 好处 ##
客户程序通过发送请求给Facade对象的方式与子系统通讯，Facade对象将这些请求转发给实际的子系统对象。但是使用Facade外观模式有如下好处:  
1. 客户程序只需知道Facade对象提供的接口，不需要知道子系统内复杂的逻辑(client与client之间的相互调用)、具体细节  
2. Facade模式有助于建立层次结构系统，也有助于对对象间的依赖关系分层  
3. Facade模式可以消除复杂的循环依赖关系，降低客户程序与子系统直接的耦合度  
4. 使用Facade的客户程序不需要直接访问子系统对象  

## 五 代码实现 ##
{%highlight c++%}
#include <iostream>

//子系统1
class SubSystemOne
{
public:
    void MethodOne() { std::cout << "SubSystemOne" << std::endl; }
};

//子系统2
class SubSystemTwo
{
public:
    void MethodeTwo() {  std::cout << "SubSystemTwo" << std::endl;  }
};

//子系统3
class SubSystemThree
{
public:
    void MethodThree() { std::cout << "SubSystemThree" << std::endl;  }
};

//Facade外观类
class Facade
{
public:
    Facade()
    {
        m_pOne = new SubSystemOne();
        m_pTwo = new SubSystemTwo();
        m_pThree = new SubSystemThree();
    }

    void MethodA()
    {
        m_pOne->MethodOne();
        m_pTwo->MethodeTwo();
    }

    void MethodB()
    {
        m_pTwo->MethodeTwo();
        m_pThree->MethodThree();
    }

private:
    SubSystemOne *m_pOne;
    SubSystemTwo *m_pTwo;
    SubSystemThree *m_pThree;
};

int main()
{
    Facade *pFacade = new Facade();
    pFacade->MethodA();
    pFacade->MethodB();

    return 0;
}

{%endhighlight%}

## 六 何时使用 ##
1. 当需要为一个复杂子系统提供一个简单、统一的接口时，可以使用Facade模式进行上一层次的封装。比如：在Linux和Window下套接字的socket接口都不一样，所以当我们在进行socket编程时，需要考虑平台的差异性，相当麻烦，而网络库ACE在上一层次上使用Facade外观模式进行封装，提供简单、统一的接口，所以我们在使用ACE进行网络编程时，我们只需要知道ACE提供的统一接口，而不需要去记Linux和Window各种函数及其参数。  
2. 在开发阶段，子系统往往因为不断的重构演化而变得越来越复杂，大多的模式在使用时也都会产生很多很小的类，这本来是好事，但也给外部调用它们的用户程序带来了使用上的困难，增加外观Facade可以提供一个简单的接口，以减少他们之间的依赖。  
3. 在维护一个遗留的大型系统时，可能这个系统已经非常难以维护和扩展了，但因为它包含非常重要的功能。此时，你可以为新系统开发一个外观Facade类，来提供设计粗糙或高度复杂等遗留代码的清晰、简单接口，让新系统与Facade对象交互，Facade与遗留代码交互所有复杂的功能。  

