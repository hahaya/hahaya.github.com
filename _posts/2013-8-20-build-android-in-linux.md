---
layout: post
title: linux下新建android项目
summary: 前面我们已经配置好linux cocos2d-x和android cocos2d-x项目的相关开发环境，那么我们如何在android cocos2d-x下新建一个我们自己的android项目呢(新建linux cocos2d-x项目请关注后面的文章)？好了，废话不多说，开始吧~
categories: [cocos2d-x]
tags: [cocos2d-x]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 一、新建android项目 ###
切换到~/cocos2d-x目录下，执行其中的create-android-project.sh脚本开始创建android项目，详细过程如下：  

        cd ~/cocos2d-x-2.1.4  
        ./create-android-project.sh  
        Input package path. For example: org.cocos2dx.example(提示信息)  
        com.hahaya.Hello(输入包名)  
        Now cocos2d-x supports Android 2.2 or upper version  
        Available Android targets:  
        ----------  
        id: 1 or "android-17"  
        Name: Android 4.2.2  
        Type: Platform  
        API level: 17  
        Revision: 2  
        Skins: WSVGA, HVGA, WXGA800, WXGA800-7in, WQVGA432, WXGA720, WQVGA400, QVGA, WVGA800 (default), WVGA854  
        ABIs : armeabi-v7a  
        input target id:  
        1(输入方案的id)  
        input your project name:  
        Hello(输入工程名)  
        ...(省略后面的输出)  

### 二、编译android项目 ###
前面已经新建好了android项目，那么接下来编译一下这个新建的android项目，切换到~/cocos2d-x-2.1.4/Hello/proj.android目录下，执行其中的build_native.sh脚本开始编译android项目，详细步骤如下：  

        cd ~/cocos2d-x-2.1.4/Hello/proj.android  
        ./build_native.sh  

执行完脚本后发现提示`please define NDK_ROOT`，所以我们需要先定义，在终端下执行`vim ~/.profile`打开配置文件，在其中加上一句`export NDK_ROOT=/home/hahaya/android/android-ndk-r8e`，修改完成后保存退出，最后在终端下执行`source ~/.profile`使配置文件的修改生效。再次执行build_native.sh脚本，最后得到如下输入说明编译成功：  

        StaticLibrary  : libchipmunk.a  
        Compile thumb  : cpufeatures <= cpu-features.c  
        StaticLibrary  : libcpufeatures.a  
        SharedLibrary  : libgame.so  
        Install        : libgame.so => libs/armeabi/libgame.so  
        make: Leaving directory '/home/hahaya/cocos2d-x-2.1.4/Hello/proj.android'  

### 三、使用eclipse编译android项目 ###
1. 在菜单中依次选择File -> Import... -> Android -> Existing Android Code Into Workspace ->Next，然后选择HelloCpp所在路径的proj.android工程(/hahaya/cocos2d-x-2.1.4/Hello/proj.android),最后点击Finish。  
2. 这里会发现工程报错，是因为还需要导入android cocos2d-x所需要的lib工程。依次在菜单中选择File -> Import... -> Android -> Existing Android Code Into Workspace，然后选择android lib工程所在的路径(/home/hahaya/cocos2d-x-2.1.4/cocos2dx/platform/android)。  
3. 到此发现AndroidManifest.xml文件中的`android:icon="@drawable/icon"`报错，将这个位置修改成`android:icon="@drawable/ic_launcher"`即可。  
4. 最后Run As Android Application，耐心等待就会看到我们熟悉的cocos2d-x界面了~

