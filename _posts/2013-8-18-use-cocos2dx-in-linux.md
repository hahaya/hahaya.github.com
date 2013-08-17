---
layout: post
title: linux搭建cocos2d-x开发环境
summary: 在window下用vs各种不爽，各种错误信息提示不完全，并且最近在玩linux，索性将cocos2d-x也移到linux下学习，但是在编译例子中的HelloCpp还是遇到各种坑爹的问题，弄了半天，才完全编译好HelloCpp，记录下问题修改过程，方便以后遇到想到的问题。
categories: [cocos2d-x]
tags: [cocos2d-x]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 一、准备工作 ###
1. 到官网[http://cocos2d-x.org/](http://cocos2d-x.org/)下载cocos2d-x源码，我这里下载的是cocos2d-x-2.1.4.zip，下载完成后解压。  
2. 下载开发Android程序所需要的JDK，直接在终端下执行`sudo apt-get install openjdk-7-jdk`安装JDK，终端下执行命令'java -version'查看JDK版本，以便测试JDK是否安装成功。  
2. 因为还会开发Android,所以接下来The Android SDK Tools，到官网[http://developer.android.com/sdk/index.html](http://developer.android.com/sdk/index.html)下载Android官方开发包,下载ADT Bundle版本的，因为里面已经包含API版本19的还有我们开发cocos2d-x所需要的eclipse，不用自己更新API和下载eclipse。下载适合自己电脑的版本SDK，然后解压。不放心的同学可以在SDK的tools目录下执行命令./android update sdk更新下tools和API。我感觉这一步不是必须的，因为这一步非常耗时间。  
3. 最后下载The Android NDK，官方下载地址为[http://developer.android.com/tools/sdk/ndk/index.html](http://developer.android.com/tools/sdk/ndk/index.html)，这个实现用C++开发Android程序。下载适合自己电脑的版本的NDK，然后解压。  

### 二、配置环境变量 ###
1. 在终端下执行`vim ~/.profile`打开配置文件。  
2. 在.profile文件末尾添加java环境变量，添加内容如下(具体路径请查看自己电脑中的安装)：  

        export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-i386  
        export PATH=$JAVA_HOME/bin:$PATH  
        export CLASSPATH=$JAVA_HOME/lib:$CLASSPATH  

3. 为了能方便的使用Android SDK中各种命令和工具，向环境变量PATH中添加Android SDK的tools路径，添加内容如下(具体路径请查看自己电脑中的安装)：  

        export PATH=-$PATH:/home/hahaya/android/adt-bundle-linux-x86-20130522/sdk/tools  

4. 同样的道理添加Android NDK路径，添加内容如下(具体路径请查看自己电脑中的安装)：  

        export PATH=$PATH:/home/hahaya/android/android-ndk-r8e  

5. 输入完成后，保存退出，在终端下执行`source ~/.profile`是配置修改生肖。  

### 三、编译cocos2d-x ###
切换到cocos2d-x解压后的目录中，执行脚本make-all-linux-project.sh进行编译，然后就可以运行cocos2d-x中自带的HelloCpp、Test等例子，这里以HelloCpp为例，在终端下依次执行如下命令：  

        cd ~/cocos2d-x-2.1.4 (具体目录请替换成自己解压后的目录)  
        ./make-all-linux-project.sh  
        cd ~/cocos2d-x-2.1.4/samples/Cpp/HelloCpp/proj.linux/bin/release/HelloCpp  
        ./HelloCpp  

### 四、Linux下运行cocos2d-x程序 ###
1. 为了在Linux下编写cocos2d-x程序，一个不错的选择就是使用eclipse，前面下载的Android SDK工具包中已经包含了Android Developer Tools，这是一个集成了C++环境的eclipse。  
2. 打开eclipse，在菜单中依次选择`File -> Import... -> C/C++ -> Existing Code as Makefile Project -> Next`，然后选择HelloCpp所在路径的proj.linux工程(/home/hahaya/cocos2d-x-2.1.4/samples/Cpp/HelloCpp/proj.linux)，勾选Lanuages中的C和C++，工具链Toolchain for indexer Settings选择Linux GCC，最后点击Finish。  
3. 接着可以在eclipse中看到打开的项目，选中项目，然后鼠标右键，接着Run As，最后Local C/C++ Application。  
4. 耐心等待编译完成，就可以看到Hello World了~  

### 五、Android下运行cocos2d-x程序 ###
1. 前面已经在Linux下成功编译、运行cocos2d-x程序，那么接下来要进行的是在Linux下编译，Android程序。  
2. 前面已经安装好JDK，并且已经配置好Android SDK和Android NDK等各种环境变量。  
3. 打开eclipse，在菜单中依次选择`Window -> Preferences -> Android`，设置该选项卡中的SDK Location(/home/hahaya/android/adt-bundle-linux-x86-20130522/sdk)，在下面可以看到Android SDK的版本信息，最后点击Apply，然后OK。  
4. 在菜单中依次选择`File -> Import... -> Android -> Existing Android Code Into Workspace ->Next`，然后选择HelloCpp所在路径的proj.android工程(/hahaya/cocos2d-x-2.1.4/samples/Cpp/HelloCpp/proj.android),最后点击Finish。  
5. 这里会发现工程报错，是因为还需要导入android cocos2d-x所需要的lib工程。依次在菜单中选择`File -> Import... -> Android -> Existing Android Code Into Workspace`，然后选择android lib工程所在的路径(/home/hahaya/cocos2d-x-2.1.4/cocos2dx/platform/android)。  
6. 选中项目，然后鼠标右键，接着Run As, 接着选择Android Application，会弹出是否添加Android模拟器对话框，点击OK，接着`Manager... -> New`，填写AVD Name，选择Device和Target，填写SD Card中的Size，一定要勾选Emulation Options中的Use Host GPU，否则在Android模拟器中运行cocos2d-x程序时会崩溃，eclipse中报模拟器不支持OpenGLES 2.0之类的错误，其余选项保持默认，最后点击OK按钮。  
7. 再次Run As Android Application，会发现eclipse的Console中提示`bash /home/hahaya/cocos2d-x-2.1.4/samples/Cpp/HelloCpp/proj.android/build_native.sh 
NDK_ROOT not defined. Please define NDK_ROOT in your environment or in local.properties`，打开/home/hahaya/cocos2d-x-2.1.4/samples/Cpp/HelloCpp/proj.android/build_native.sh，在build_native.sh文件44行左右设置NDK_ROOT，将这个位置该为如下所示：  

        # paths  
        NDK_ROOT=/home/hahaya/android/android-ndk-r8e（新加的一行）  
        if [ -z "${NDK_ROOT+aaa}" ];then  

8. 重复Run As Android Application，但是最后还是报错了，错误为`Description   Resource    Path    Location    Type
Android NDK: WARNING: APP_PLATFORM android-14 is larger than android:minSdkVersion 8 in ./AndroidManifest.xml   HelloCpp        line 128, external location: /home/hahaya/android/android-ndk-r8e/build/core/add-application.mk C/C++ Problem`，所以按照它的提示修改项目中的AndroidManifest.xml，将第6行中的minSdkVersion值修改成14(当然也可以修改成使用的Android SDK版本)，修改后的内容为`<uses-sdk android:minSdkVersion="14"/>`。  
9. 无赖的再次Run As Android Application，编译完成后，耐心等待Android模拟启动好(初次启动要好几分钟)，最后在Android模拟器中终于看到我们熟悉的cocos2d-x欢迎界面(如果没有看到可以尝试重新启动Android模拟器或者Clean Project在Run As Android Application)~  

