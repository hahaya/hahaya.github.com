---
layout: post
title: enable_shared_from_this模板类使用完全解析
summary: 以前都没有用过enable_shared_from_this模板类，虽然经常遇到但是也没怎么去关注，今天抽时间好好学习了下enable_shared_from_this模板类，发现在使用shared_ptr模板类和enable_shared_from_this模板类时有许多陷阱的，故记录于此。
categories: [boost]
tags: [boost]
publish: true
---

# {{ page.title }} #
{{ page.summary }} 

### 什么时候该使用enable_shared_from_this模板类 ###
在看下面的例子之前，简单说下使用背景，单有一个类，某个函数需要返回当前对象的指针，我们返回的是shared_ptr<T>，为什么使用智能指针呢，这是因为：当我们使用智能指针管理资源时，必须统一使用智能指针，而不能再某些地方使用智能指针，某些地方使用原始指针，否则不能保持智能指针的语义，从而产生各种错误。好了，介绍完背景，看下面的一段小程序：  

{%highlight c++%}
#include <iostream>
#include <boost/shared_ptr.hpp>

class Test
{
public:
    //析构函数
    ~Test() { std::cout << "Test Destructor." << std::endl; }

    //获取指向当前对象的指针
    boost::shared_ptr<Test> GetObject()
    {
        boost::shared_ptr<Test> pTest(this);
        return pTest;
    }
};

int main(int argc, char *argv[])
{
    {
        boost::shared_ptr<Test> p( new Test( ));
        boost::shared_ptr<Test> q = p->GetObject();
    }

    return 0;
}
{%endhighlight%}  

程序输出：  

		Test Destructor.  
		Test Destructor.  

从上面的输出你发现了什么，很明显的发现只创建new了一个Test对象，但是却调用了两次析构函数，这对程序来说肯定是一个灾难。为什么会出现这种情况呢？main函数中的`boost::shared_ptr<Test> p( new Test( ));`将shared_ptr<Test>中引用计数器的值设置为1，而在GetObject函数中又通过`boost::shared_ptr<Test> pTest(this);`又将shared_ptr<Test>中的引用计数器的值增加了1，故在析构时一个Test对象被析构了两次。即产生这个错误的原因是通过同一个Test指针对象创建了多个shared_ptr<Test>，这是绝对禁止的。同时这也提醒我们在使用shared_ptr时一定不能通过同一个指针对象创建一个以上的shared_ptr对象。那么有什么方法从一个类的成员函数中获取当前对象的shared_ptr呢，其实方法很简单：只需要该类继承至enable_shared_from_this<T>模板类,然后在需要shared_prt<T>的地方调用enable_shared_from_this<T>模板类的成员函数shared_from_this()即可，下面是改进后的代码：  

{%highlight c++%}
#include <iostream>
#include <boost/enable_shared_from_this.hpp>
#include <boost/shared_ptr.hpp>

class Test : public boost::enable_shared_from_this<Test>        //改进1
{
public:
    //析构函数
    ~Test() { std::cout << "Test Destructor." << std::endl; }

    //获取指向当前对象的指针
    boost::shared_ptr<Test> GetObject()
    {
        return shared_from_this();      //改进2
    }
};

int main(int argc, char *argv[])
{
    {
        boost::shared_ptr<Test> p( new Test( ));
        boost::shared_ptr<Test> q = p->GetObject();
    }

    return 0;
}
{%endhighlight%}  

程序输出：  

		Test Destructor.

从输出对象只被析构了一次，这是我们想要的结果，因此enable_shared_from_this<T>模板类的作用是：用来作为一个基类，它允许从一个成员函数中获得一个当前对象的shared_ptr。那么enable_shared_from_this<T>模板类到底是如何工作的了？请看下文分解~

### enable_shared_from_this模板类实现 ###
打开enable_shared_from_this.hpp文件，会发现enable_shared_from_this<T>模板类的实现如下：  

{%highlight c++%}
template<class T> class enable_shared_from_this
{
protected:

    enable_shared_from_this() BOOST_NOEXCEPT
    {
    }

    enable_shared_from_this(enable_shared_from_this const &) BOOST_NOEXCEPT
    {
    }

    enable_shared_from_this & operator=(enable_shared_from_this const &) BOOST_NOEXCEPT
    {
        return *this;
    }

    ~enable_shared_from_this() BOOST_NOEXCEPT // ~weak_ptr<T> newer throws, so this call also must not throw
    {
    }

public:

    shared_ptr<T> shared_from_this()
    {
        shared_ptr<T> p( weak_this_ );
        BOOST_ASSERT( p.get() == this );
        return p;
    }

    shared_ptr<T const> shared_from_this() const
    {
        shared_ptr<T const> p( weak_this_ );
        BOOST_ASSERT( p.get() == this );
        return p;
    }

public: // actually private, but avoids compiler template friendship issues

    // Note: invoked automatically by shared_ptr; do not call
    template<class X, class Y> void _internal_accept_owner( shared_ptr<X> const * ppx, Y * py ) const
    {
        if( weak_this_.expired() )
        {
            weak_this_ = shared_ptr<T>( *ppx, py );
        }
    }

private:

    mutable weak_ptr<T> weak_this_;
};
{%endhighlight%}  

从enable_shared_from_this<T>模板类的实现文件中我们可以很容易的发现我们只能使用返回shared_ptr<T>的shared_from_this()和返回shared_ptr<T const>的shared_from_this()，因为这两个版本的shared_from_this()是public权限的，还有一个public权限的是_internal_accept_owner函数，但是注释中已经明显指出不能调用这个函数，这个函数会被shared_ptr<T>自动调用，_internal_accept_owner函数用来初始化enable_shared_from_this<T>模板类中的唯一成员变量weak_ptr<T> weak_this_。而shared_from_this()中是通过将weak_ptr<T> weak_this_转化成shared_ptr<T>和shared_ptr<T const>来返回的，因此在使用shared_from_this()之前需要先初始化weak_ptr<T> weak_this_对象，而weak_ptr<T> weak_this_对象是在_internal_accept_owner函数中进行的初始化，也就是说先需要创建shared_ptr<T>对象。即在使用shared_from_this()函数之前，应该先初始化对象的基类enable_shared_from_this<T>,接着再初始化对象，最后初始化shared_ptr<T>。正因为有这个特点所以会出现以下常见的错误：

### 使用enable_shared_from_this常见错误 ###
先来看情形1：  

{%highlight c++%}
class Test : public boost::enable_shared_from_this<Test>
{
	Test() { boost::shared_ptr<Test> pTest = shared_from_this(); }
};
{%endhighlight%}  

这种用法明显是错的，虽然对象的基类enable_shared_from_this<Test>类的构造函数已经被调用，但是shared_ptr<Test>的构造函数并没有被调用，因此weak_ptr<T> weak_this_并没有被初始化，所以这时调用shared_from_this()是错误的。  

接着我们来看情形2：  
{%highlight c++%}
class Test : public boost::enable_shared_from_this<Test>
{
	void func() { boost::shared_ptr<Test> pTest = shared_from_this(); }
};

int main()
{
	Test test;
	test.func();	//错误

	Test pTest = new Test;
	pTest->func(); //错误
}
{%endhighlight%}  

同样这种做法也是错误的，和情形1同样的原因shared_ptr<Test>的构造函数并没有被调用，因此weak_ptr<T> weak_this_并没有被初始化。  

正确的做法应该是：  
{%highlight c++%}
class Test : public boost::enable_shared_from_this<Test>
{
	void func() { boost::shared_ptr<Test> pTest = shared_from_this(); }
};

int main()
{
	shared_ptr<Test> pTest( new Test() );
	pTest->func();
}
{%endhighlight%}  

`shared_ptr<Test> pTest( new Test() );`这句话依次执行的顺序是：1 调用enable_shared_from_this<Test>的构造函数。2 调用Test的构造函数。 3 调用shared_ptr<Test>的构造函数初始化weak_ptr<T> weak_this_。最后才能通过func()函数使用shared_from_this函数。  

从上面的错误中我们知道在使用enable_shared_from_this<T>类中的shared_from_this()函数时应该注意：  
1. 不能在对象的构造函数中使用shared_from_this()函数。  
2. 先需要调用enable_shared_from_this<T>类的构造函数，接着调用对象的构造函数，最后需要调用shared_ptr<T>类的构造函数初始化enable_shared_from_this<T>的成员变量weak_this_。然后才能使用shared_from_this()函数。    
3. 如何程序中使用了智能指针shared_ptr<T>,则程序中统一使用智能指针，不能使用原始指针，以免出现错误。  
