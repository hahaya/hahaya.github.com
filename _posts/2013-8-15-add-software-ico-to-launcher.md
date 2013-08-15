---
layout: post
title: Ubuntu添加应用程序图标到桌面启动器Launcher
summary: Linux有有些绿色软件，不需要安装就可以双击运行。但是有些程序打开后，直接在Launcher中右键选择Lock to Launcher会使用默认图标，一点都不美观。并且即使锁定到Launcher中，单击后一闪，什么都没有发生，并没有启动应用程序。比如说：eclipse、Sublime Text等。下面就以eclipse做演示，如果解决遇到的问题。
categories: [linux]
tags: [linux]
published: true
---

# {{ page.title }} #
{{ page.summary }}

1 在终端下执行`cd /usr/share/applications`，接着执行`ls`，会发现/usr/share/applications目录下有许多以 .desktop 结尾的文件，这些便是那些可以在 Launcher 中单击启动并配有漂亮图标的程序的配置文件，称之为 Desktop Entry。  
2 确保此时在/usr/share/applications目录下，执行`sudo vim eclipse.desktop`，新建一个eclipse的Desktop Entry，并将其打开，输入如下内容：  

        [Desktop Entry]  
        Encoding=UTF-8  
        Version=3.9  
        Type=Application  
        Terminal=false  
        Icon=/home/hahaya/eclipse/icon.xpm  
        Name=eclipse  
        Comment=eclipse  
        Icon[zh_CN]=/home/hahaya/eclipse/icon.xpm  
        Name[zh_CN]=eclipse  
        Comment[zh_CN]=eclipse  
        Exec=/home/hahaya/eclipse/eclipse %F  

其中:Icon 为图标所在路径，Name 为你想要显示在 Launcher 中的名称，Comment 为说明，最后Exec为应用程序路径。%F”就是能够让这个程序显示在"以其它方式启动"的列表中。最后需要注意的是，这里面的路径全部都需要使用绝对路径。  
3 保存之后，你再双击启动eclipse，然后锁定到 Launcher，此时关闭eclipse，再点 Launcher 中的图标就可以顺利启动程序了。

