---
layout: post
title: 函数对象、lambda、function、bind学习
description: C++11中引入了std::lambda、std::function、std::bind非常好用的特性，本文从一个例子开始，然后引出如何使用std::lambda、std::function、std::bind将这个例子改得更简洁、方便
category: blog
tags: c++
published: true
---

## 一 函数对象 ##
在学习其他知识之前，先来学习函数对象，然后引出std::lambda、std::function、std::bind等内容的学习，那么究竟什么是函数对象呢？  
函数对象(Function Object)又称函数对象类、仿函数、高阶函数等，函数对象实际上是指那些可以被传入其他函数或是从其他函数返回的函数(比如std::for_each函数的第3个参数就要求传入接受一个参数的函数或函数对象),是不是和函数指针的作用很相似，后面会介绍函数对象和函数指针的差别～  
感觉上面关于函数对象的定义还是好复杂呀，通俗的讲函数对象就是一个重载了operator()操作符的类，这就是函数对象和普通类的差别，也就是说重载了operator()操作符的类都可以叫函数对象类，由于重载了operator()操作符的类有和普通函数类似的使用方法(但是函数对象使用前需要定义一个对象，准确来说应该和函数指针更相似，函数指针在使用前也需要typedef定义一个类型)，故称函数对象、函数对象类、仿函数等等。下面来看一个简单的函数对象及其使用:  

{%highlight c++%}
#include <iostream>

//普通函数
int add(int a, int b)
{
    return a + b;
}

//函数对象类
class FunctionObjectDefine
{
public:
    int operator()(int a, int b) { return a + b; };
};

int main()
{
    FunctionObjectDefine func;
    int total = add(1, 2);
    int sum = func(1, 2); //是不是和普通函数add(1, 2)调用方式一样
    std::cout << "Total:" << total << std::endl;
    std::cout << "Sum:" << sum << std::endl;
    return 0;
}
{%endhighlight%}  

## 二 函数对象和函数指针 ##
前面提到函数对象和函数指针的作用很相似，下面先看一个小例子:  

{%highlight c++%}
#include <iostream>

int add_func(int a, int b)
{
    return a + b;
}

//函数对象
class AddClass
{
public:
    int operator()(int a, int b) { return a + b; }
};

//函数指针
typedef int (*AddFunction)(int a, int b);

int main()
{
    //为了方便对比 将函数对象和函数指针声明了同名变量 
    //为了防止报错 故两个同名变量都有各自的作用域 每个的作用域在各自的{}中
    //通过后面的调用发现两者调用方式是一样的 都是通过add(1, 2)调用
    {
        //函数对象的使用
        AddClass add;
        int sum = add(1, 2);
        std::cout << "Sum:" << sum << std::endl;
    }

    {
        //函数指针的使用
        AddFunction add = &add_func;
        int sum = add(2, 2);
        std::cout << "Sum:" << sum << std::endl;
    }

    return 0;
}
{%endhighlight%}  

通过上面的小例子我们很容易发现，函数对象和函数指针在定义的方式不一样，但是调用的方式是一样的。既然已经有了函数指针这个东西，为什么还要发明函数对象了，其实很简单，函数对象可以将附加数据保存在成员变量中，从而实现携带附加数据，而函数指针就不行了。考虑下面一个应用场景，我们需要使用std::for_ecah将一个std::vector<int>中的每一个值加上某个值然后输出，如果使用普通函数，则其声明应该为`void add_num(int value, int num)`,其中value为容器中的元素，num为要加上的数。但是由于std::for_each函数的第3个参数就要求传入接受一个参数的函数或函数对象,所以将add_num函数传入std::for_each是错误的，然而函数对象可以携带附加数据解决这个问题，看下面的例子：  

{%highlight c++%}
#include <iostream>
#include <vector>
#include <algorithm>

class Add
{
public:
    Add(int num) : num_(num) 
    { } 

    void operator()(int value) 
    { std::cout << value + num_ << std::endl; }

private:
    int num_;
};

int main()
{
    std::vector<int> vecInt;
    vecInt.push_back(1);
    vecInt.push_back(2);
    vecInt.push_back(3);

    Add add(2);
    //std::for_each的第3个对象为函数对象
    std::for_each(vecInt.begin(), vecInt.end(), add);
}
{%endhighlight%}  

当然函数对象和函数指针还有其他方面的差别，在此就不一一介绍了，但是自从有了std::bind之后，我们也可以在std::for_each中使用带有两个参数的add_num，具体的使用会在std::bind中介绍。当然也许你会觉得为了调用std::for_each还要自己写一个函数对象类很繁琐，那么下面的std::lambda是你想找的的东西～

## 三 std::lambda ##
### 1 引入std::lambda ###
lambda是C++11中才引入的新特性，使程序员能定义匿名对象，而不必定义独立的函数和函数对象，使代码更容易编写和理解，又能防止别人的访问(调用)。  
考虑我们上面的一个例子,是不是为了使用STL中的某个算法，而需要自己去实现函数对象类很繁琐，因此很多程序员宁愿自己写循环也不愿意使用std::for_each等STL算法，如此以来，STL算法失去了意义，也丢掉了编译优化的机会，那么请看下面使用std::lambda来简化这个例子(使用g++ -std=c++11 lambda_for_each.cc编译)  

{%highlight c++%}
#include <iostream>
#include <vector>
#include <algorithm>

int main()
{
    std::vector<int> vecInt;
    vecInt.push_back(1);
    vecInt.push_back(2);
    vecInt.push_back(3);

    std::for_each(vecInt.begin(), 
                  vecInt.end(), 
                  [](int x){ std::cout << x + 2 << std::endl; });
}
{%endhighlight%}  

通过std::lamda改进后的例子是不是很简单、方便？lambda使创建这种简单的函数对象类更加方便，上面例子中的lambda表达式`[](int x){ std::cout << x + 2 << std::endl; }`会让编译器产生一个类似前面例子中Add的未命名函数对象类，并且具有以下优点:  
1. 简洁，不许要自己去实现函数对象类  
2. 不会为临时的使用而引入新的名字，所以不会导致名字污染(不会引入Add、add等名字)  
3. 函数对象类名不如它的实际代码的表达能力强，把代码放在更靠近调用它的地方将提高代码清晰度  

### 2 std::lambda语法 ###
std::lambda表达式(函数)能构造一个闭包，在作用域内捕获变量一个的匿名函数对象。 常用的std::lambda表达式的语法如下：  

	[ capture ] ( params ) mutable exception attribute -> ret { body } 	(1) 	
	[ capture ] ( params ) -> ret { body } 					(2) 	
	[ capture ] ( params ) { body } 					(3) 	
	[ capture ] { body } 							(4) 	

**不同形式的语法说明**
(1)完整的声明  
(2)一个const类型的lambda声明：捕获外部对象的值不能被修改，如果需要修改则需要加上mutable关键字  
(3)省略返回值类型的lambda声明：省略返回值的lambda声明有两种情况(a)body只有一个return语句，那么返回值类型是return后面的表达式的类型(使用自动推导)(b)返回值类型是void  
(4)省略参数列表：函数没有参数，即参数列表是()  
</br>
**解释**
capture - 捕获块，指定哪些外部变量可以在lambda函数体body中可见,符号可按如下规则传入:  
	
	[]      不捕获任何外部变量  
	[=]     以值的形式捕获lambda表达式所在函数的函数体中的所有外部变量  
	[&]     以引用的形式捕获lambda表达式所在函数的函数体中的所有外部变量  
	[a,&b]  按值捕获a，并按引用捕获b  
	[=, &a] 以引用的形式捕获a，其余变量以值的形式捕获  
	[&， a] 以值的形式捕获a，其余变量以引用的形式捕获  
	[this]  按值捕获了this指针   

params - 参数列表，与命名函数一样  
mutable - 允许body修改传进来的形参，以及调用它们的非const成员函数  
exception - 提供闭包类型的operator()成员函数的异常说明或noexcept语句  
attribute - 提供闭包类型的operator()成员函数的属性说明
ret - 返回值类型。如果不存在，它由该函数的return语句来隐式决定（或者是void，例如当它不返回任何值的时候）  
body - 函数体   

### 3 闭包示例 ###
{%highlight c++%}
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

int main()
{
    //eg1 直接输出hello lambda. 
    //尾部的()使该lambda表达式可立即执行
    //前面的lambda表达式产生一个匿名对象 结合后面的()相当与一个无參的函数调用
    []{ std::cout << "hello lambda." << std::endl; }();

    //eg2 该lambda表达式接收一个const std::string&类型的参数
    //返回一个std::string类型的值 结果保存在lambda_return变量中
    //尾部的("hahaya")表示传入一个"hahaya"参数使lambda表达式立即执行
    std::string lambda_return = [](const std::string &str)->std::string{
            return "hello " + str; }("hahaya");
    std::cout << lambda_return << std::endl;

    //eg3 该lambda表达式接收一个const std::string&类型的参数
    //lambda表示式的返回值通过return语句推导
    //lambda表达式产生一个匿名对象 保存在func对象中
    auto func = [](const std::string &str){ return "hello " + str; };
    std::cout << func("ToSmile") << std::endl;
    std::cout << func("C++") << std::endl;

    //eg4 按传值的方式捕获外部变量 
    //需要加上mutable关键字 否则不能在lambda表达式中修改total的值
    //由于是传值方式  所以在lambda表达式外部total的值并没有改变 但是在lambda表达式内部改变了
    int total = 0;
    [total](int num)mutable{ total += num; std::cout << total << std::endl; }(2);
    std::cout << "capture by value:" << total << std::endl;

    //eg5 按传引用的方式捕获外部变量
    //不需要加上mutable关键字
    //由于是传引用方式 所以在lambda表达式内部和外部都在total的值改变了
    [&total](int num){ total += num; std::cout << total << std::endl; }(2);
    std::cout << "capture by reference:" << total << std::endl;

    //eg6 lambda和stl的配合使用
    std::vector<int> vecInt;
    vecInt.push_back(1);
    vecInt.push_back(2);
    vecInt.push_back(3);
    std::for_each(vecInt.begin(), vecInt.end(), [](int val){std::cout << val + 2 << std::endl;});

    std::cout << std::endl;
    std::vector<int> secInt;
    secInt.push_back(7);
    secInt.push_back(8);

    //eg7 lambda和stl的配合使用 先保存匿名对象后调用
    auto add_func = [](int val){std::cout << val + 2 << std::endl; };
    std::for_each(secInt.begin(), secInt.end(), add_func);


    return 0;
}
{%endhighlight%}  

### 4 闭包类型 ###
在前面的例子中，我们函数对象类名为Add，而后面的例子中lambda表达式执行后由编译器生成自动生成的函数对象有不同的类型名字，并且只有编译器知道这个类型名字，可以认为它是一个未命名类型，即所谓的闭包类型(ClosureType)。来lambda表达式产生的临时对象叫做闭包对象。类型的匿名性并不影响std::for_each的调用，因为它是一个函数模板，会进行类型推导  

## 四 std::function ##
### 1 引入std::function ###
在前面的例子中`auto add_func = [](int val){std::cout << val + 2 << std::endl; };`我们使用auto add_func来保存lambda表达式生成的闭包对象，使用auto参数类型推导出add_fucn型的类型(闭包类型ClosureType)。由于闭包类型可以隐式地转换为std::function，下面例子中说明如何将闭包类型转换成std::function  

{%highlight c++%}
#include <iostream>
#include <functional>    //std::function需要的头文件
#include <algorithm>    //std::for_each需要的头文件
#include <vector>

int main()
{
    std::vector<int> vecInt;
    vecInt.push_back(1);
    vecInt.push_back(2);
    vecInt.push_back(3);

    //lambda产生的闭包类型能隐式转换成std::function
    std::function<void(int)> func = 
        [](int val){ std::cout << val + 2 << std::endl; };

    std::for_each(vecInt.begin(), vecInt.end(), func);

    return 0;
}
{%endhighlight%}  

### 2 std::function介绍 ###
那么std::function究竟是个什么东西呢？其实std::function是一个类模板，std::function可以对函数(普通函数、成员函数)、lambda表达式、std::bind的绑定表达式、函数对象等进行封装。std::function的实例可以对这些封装的目标进行存储、复制和调用等操作，下面来看个例子:  

{%highlight c++%}
#include <iostream>
#include <functional>    //std::function需要的头文件
#include <algorithm>    //std::for_each需要的头文件
#include <vector>

int main()
{
    std::vector<int> vecInt;
    vecInt.push_back(1);
    vecInt.push_back(2);
    vecInt.push_back(3);

    //lambda产生的闭包类型能隐式转换成std::function
    std::function<void(int)> func = 
        [](int val){ std::cout << val + 2 << std::endl; };

    std::for_each(vecInt.begin(), vecInt.end(), func);

    return 0;
}
{%endhighlight%}  

### 3. 提升std::function的性能 ###
在构造std::function时存在两个隐藏，但是可预防的开销:  
1. std::function构造函数按值传递被包装目标，这意味这会进行拷贝。而构造函数会将这个拷贝转发到一系列辅助函数上，而这些辅助函数中大多数也是按值传递，这也就意味这更多的拷贝。  
2. 第二个开销与被封装目标的大小有关。std::function实现采用了标准建议的小对象优化技术 (small object optimization)，以避免动态内存分配。通常，它们使用一个数据成员存储被包装函数对象的拷贝。但是，因为被包装目标的大小是在 std::function 构造时确定，被包装对象较大时(如函数对象)成员存储可能不足以容纳其拷贝。这时，将调用 new（除非自定义分配器）在堆上创建拷贝，只在数据成员中保存拷贝的指针。超出就分配堆存储的准确大小，依赖于具体平台和内存对齐。  
为了解决上面的问题，应该避免使用拷贝和大封装目标，最直接的想法是引用代替拷贝。但是，这通常很难，因为我们有时需要 std::function 比它的原始被包装函数对象有更长的生存期  
这是个老问题，类模板 std::reference_wrapper 包装一个对象的引用，并提供到被包装类型的自动类型转换，这使得 std::reference_wrapper 可用在很多需要被包装类型的地方。std::reference_wrapper 和引用的大小相同，即它很小。另外，有两个函数模板 std::ref 和 std::cref，分别用来简化非 const 和 const 的 std::reference_wrappers 的创建（就像用 std::make_pair 简化 std::pairs 的创建），下面我们看看它们是如何使用的:  

{%highlight c++%}
#include <iostream>
#include <functional> //std::function需要的头文件
#include <algorithm>
#include <vector>

int main()
{
    //std::reference_wrapper封装int内置类型
    int number = 1;
    std::reference_wrapper<int> rw(number);
    std::cout << "Number:" << rw.get() << std::endl;

    std::vector<int> vecInt;
    vecInt.push_back(1);
    vecInt.push_back(2);
    vecInt.push_back(3);

    //std::ref只能用于左值 最下面一行代码直接使用std::ref引用lambda表达式目前是编译不过的(lambda表达式是右值)
    //所以先用auto func对象保存lambda表达式返回的闭包对象 再std::for_each再对func进行引用
    auto func = [](int val){std::cout << val + 2 << std::endl;};
    std::for_each(vecInt.begin(), vecInt.end(), std::ref(func));
    //std::for_each(vecInt.begin(), vecInt.end(),
            //std::ref( [](int val){std::cout << val + 2 << std::endl;} ));
    return 0;
}
{%endhighlight%}  

## 五 std::bind ##
### 1 引入std::bind ###
说完std::function,那么不得不说下它的好基友std::bind，下面我们来看看如何使用std::bind来改进前面使用for_each的例子:  

{%highlight c++%}
#include <iostream>
#include <functional>
#include <algorithm>
#include <vector>

//普通函数
int print_add(int value, int num)
{
    std::cout << value + num << std::endl;
}

int main()
{
    std::vector<int> vecInt;
    vecInt.push_back(1);
    vecInt.push_back(2);
    vecInt.push_back(3);

    
    std::cout << "---------使用auto对象保存std::bind返回的对象------------" << std::endl;
    auto func = std::bind(print_add, std::placeholders::_1, 222);
    std::for_each(vecInt.begin(), vecInt.end(), func); 

    std::cout << "---------直接将std::bind返回的对象用在std::for_each中------" << std::endl;
    std::for_each(vecInt.begin(),
                vecInt.end(),
                std::bind(print_add, std::placeholders::_1, 222));

    return 0;

}
{%endhighlight%}  

### 2 std::bind ###
std::bind其实是一系列的函数模板，在头文件 <functional> 中定义，函数原型如下：  

	template< class F, class... Args >  
	/*unspecified*/ bind( F&& f, Args&&... args );  
	template< class R, class F, class... Args >  
	*unspecified*/ bind( F&& f, Args&&... args );  
函数模板std::bind能对普通函数、成员函数、静态成员函数、公共成员变量、公共静态成员变量等进行包装，调用std::bind的包装相当与将函数名和参数绑定在函数内部。std::bind函数模板返回的函数对象的类型是不确定的，但是可以存储在std::function内。std::bind绑定的参数是通过传值的方式传递的，如果需要通过引用传递则参数先需要用std::ref、std::cref进行引用，然后在传递给std::bind
将std::bind函数模板的返回值保存在std::function后，调用时需要传递的参数个数由std::bind中的占位符（std::placeholders::_1、std::placeholders::_2、std::placeholders::_3等）个数决定，即有几个占位符调用时就需要几个参数

### 3 std::bind示例 ###
{%highlight c++%}
#include <iostream>
#include <functional>

//带有引用参数的普通函数
void display(int first, int &second)
{
    std::cout << "first: " << first << " second:" << second << std::endl;
}

//普通函数
int get_number(int number)
{
    return number;
}

class Test
{
public:
    Test(int num) : num_(num)
    { }

    //静态成员函数
    static void say_hello()
    { std::cout << "hello"  << std::endl; }

    //成员函数
    void print_add(int value)
    { std::cout << "add:" << value + num_ << std::endl; }

public:
    int num_;
};

int main()
{
    //绑定普通函数
    //使用auto接收std::bind的返回值
    std::cout << "绑定普通函数" << std::endl;
    auto bind_comm_func = std::bind(get_number, std::placeholders::_1);
    std::cout << bind_comm_func(2) << std::endl;
    //使用std::function接收std::bind的返回值
    std::function<int(int)> bind_comm_func_1 = std::bind(get_number, std::placeholders::_1);
    std::cout << bind_comm_func_1(22) << std::endl;
    std::cout << "绑定普通函数" << std::endl;


    //绑定带有引用参数的普通函数
    std::cout << "绑定带有引用参数的普通函数" << std::endl;
    int value = 22222;
    //auto
    auto bind_ref_func = std::bind(display, std::placeholders::_1, std::ref(value));
    bind_ref_func(1111);
    //std::bind
    std::function<void(int)> bind_ref_func_1 = std::bind(display, std::placeholders::_1, std::ref(value));
    bind_ref_func_1(22222);
    std::cout << "绑定带有引用参数的普通函数" << std::endl;

    
    //绑定静态成员函数
    std::cout << "绑定静态成员函数" << std::endl;
    //auto
    auto bind_static_member_func = std::bind(&Test::say_hello);
    bind_static_member_func();
    //std::function
    std::function<void(void)> bind_static_member_func_1 = std::bind(&Test::say_hello);
    bind_static_member_func();
    std::cout << "绑定静态成员函数" << std::endl;

    //绑定成员函数 需要多传递一个函数对象 故先需要创建函数对象
    std::cout << "绑定成员函数" << std::endl;
    //auto
    Test test(2);
    auto bind_member_func = std::bind(&Test::print_add, test, std::placeholders::_1);
    bind_member_func(2);
    //std::function
    std::function<void(int)> bind_member_func_1 = std::bind(&Test::print_add, test, std::placeholders::_1);
    bind_member_func_1(3);
    std::cout << "绑定成员函数" << std::endl;

    //绑定public成员变量
    std::cout << "绑定public成员变量" << std::endl;
    //auto
    auto bind_member_data = std::bind(&Test::num_, std::placeholders::_1);
    std::cout << bind_member_data(test) << std::endl;
    //int a = bind_member_data(test);
    //std::cout << "a" <<  a << std::endl;
    //std::function
    std::function<int(Test)> bind_member_data_1 = std::bind(&Test::num_, std::placeholders::_1);
    std::cout << bind_member_data_1(test) << std::endl;
    std::cout << "绑定public成员变量" << std::endl;
    
    return 0;
}
{%endhighlight%}  

## 六 总结 ##
好了，文章到这里也就该结束了，本文从std::for_each的问题引出函数对象、std::lambda、std::function、std::bind，并使用函数对象、std::lambda、std::function、std::bind解决std::for_each要求第3个参数为带一参数的函数或函数对象这一局限。  
PS:文章中例子的编译需要C++11支持，并且所有例子在gcc4.8.1下编译通过,使用gcc编译时需要带上-std=c++11这一编译选项
