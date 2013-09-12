---
layout: post
title: 开始学习boost
summary: 最近又是很长时间没有更新博客了，这段时间一直在跳跃性的学习：cocos2d-x、qt自定义窗体、boost.asio等等，但是一直没有怎么整理出来，偷懒了，这样是不行的，现在再一次开始学习boost，那么就从如何安装boost开始吧，这是很重要的一步，只有安装好了才能进行接下来的学习，好了，废话不多说，开始吧...
categories: [boost]
tags: [boost]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 一、下载boost ###
要安装boost，先要获取到boost的源码，获取很简单，打开boot官网[http://www.boost.org](http://www.boost.org)，在最右边切换到Download页面，选择自己想要下载的版本，我这里使用的是最新版本1.54.0，下载完成后，选择一个适当的地方，然后解压。

### 二、安装boost ###
1. 切换到解压后的boost目录中，在终端下执行`./bootstrap.sh`(win下执行bootstrap.bat)进行编译前的配置工作。  
2. 接着进行boost的完整编译，在终端下执行`./b2 toolset=gcc --buildtype=complete stage`进行完整编译，其中toolset设置编译工具为gcc，buildtype设置编译类型为完全编译，stage选项则指定boost使用本地构建。如果使用install选项则编译后会把boost安装到/usr/local路径下。  
3. 执行`vim ~/.profile`打开配置文件，修改环境变量，在其中添加如下内容：  

        BOOST_ROOT=/home/hahaya/boost_1_53_0/  
        BOOST_LIB=/home/hahaya/boost_1_53_0/stage/lib/  

        export PATH=$BOOST_ROOT:$PATH  
        export PATH=$BOOST_LIB:$PATH  

4. 添加完成后，保存退出，执行`source ~/.profile`使修改生效  

### 三、测试boost是否安装成功 ###
1. 新建一个ccp文件，输入如下内容:  

{%highlight cpp%}
#include <iostream>
#include <boost/timer.hpp>

int main(int argc, char *argv[]){

    boost::timer t;

    std::cout << "Hello,Boost." << std::endl;
    std::cout << "Max timespan: " << t.elapsed_max() / 3600 << " h" << std::endl;

    return 0;
}
{%endhighlight%}
  
2. 输入完成后保存退出，在终端下执行`g++ time.cpp -o time`进行编译，没有错误后，在终端下输入`./time`执行程序，如果看到程序输出`Hello,Boost.    Max timespan: 0.596523 h`等字样，那么恭喜你，boost环境已经配置成功，那么接下来开始boost之旅吧~
