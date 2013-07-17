---
layout: post
title: Ubuntu 12.04下编译Vim
summary: 最近想使用一个Vim的插件YouCommentMe，发现这是自动补全的神器，该插件要求Vim版本为7.3.548或者更高，但是Ubuntu 12.04上装的是7.3，所以不得不重新编译Vim，纠结的过程，记录一下编译过程，说不定以后还会用到。
categories: [vim]
tags: [vim]
published: true
---

# {{ page.title }}
{{ page.summary }}

### 一、下载所需工具 ###
编译Vim之前，需要下载编译的相关工具和一些库，还需要下载Vim开发版本所需要的下载工具Mercurial，依次在终端下执行下列命令(如果有安装没成功先执行下`sudo apt-get update`)：  

        sudo apt-get install libncurses5-dev  
        sudo apt-get install libgnome2-dev  
        sudo apt-get install libgnomeui-dev  
        sudo apt-get install libgtk2.0-dev  
        sudo apt-get install libatk1.0-dev  
        sudo apt-get install libbonoboui2-dev  
        sudo apt-get install libcairo2-dev  
        sudo apt-get install libx11-dev  
        sudo apt-get install libxpm-dev  
        sudo apt-get install libxt-dev  
        sudo apt-get install python-dev  
        sudo apt-get install ruby-dev  
        sudo apt-get install mercurial  

### 二、卸载老版本vim ###
在安装新版本的Vim之前，你需要卸载原来安装的老版本Vim，依次在终端下执行下列命令：  

        sudo apt-get remove vim  
        sudo apt-get remove vim-runtime  
        sudo apt-get remove gvim  
        sudo apt-get remove vim-tiny  
        sudo apt-get remove vim-common  
        sudo apt-get remove vim-gui-common  

### 三、编译新版本vim ###
1. 首先依次在终端下执行下列命令下载最新版Vim源码：  

        cd ~  
        hg clone https://code.google.com/p/vim  

2. 在下载的源码目录下查看README.txt，得到所下载vim版本的源码，后面设置VIMRUNTIMEDIR会用到  
3. 在终端下执行如下命令设置Vim源码的编译属性  

        cd vim  
        ./configure --with-features=huge --enable-rubyinterp \    
        --enable-pythoninterp --enable-luainterp --enable-perlinterpi \    
        --enable-multibyte --enable-sniff  --enable-fontset --enable-cscopei \    
        --disable-gui --prefix=/usr  
        make VIMRUNTIMEDIR=/usr/share/vim/vim74a  

        (a) --with-features=huge：支持最大特性  
        (b) --enable-rubyinterp：启用Vim对ruby的支持  
        (c) --enable-pythoninterp：启用Vim对python的支持  
        (d) --enable-luainterp：启用Vim对lua的支持  
        (e) --enable-perlinterp：启用Vim对perl的支持  
        (f) --enable-multibyte：多字节支持 可以在Vim中输入中文  
        (g) --enable-sniff：Vim状态提示 提示Vim当前处于INSERT、NORMAL、VISUAL哪种模式  
        (h) --enable-cscope：Vim对cscope支持  
        (i) --disable-gui：不用编译生成图形界面版gvim  
        (j) --prefix=/usr：编译安装路径  
        (k) 更多参数执行./configure --help查看  
4. 在终端下执行如下命令开始安装vim  

        sudo make install

### 四、遇到的问题 ####
编译好了的Vim 7.4a，使用起来还不错，但是用着用着发现一个问题：在INSERT模式下，退格键(backspace)不能删除换行，也就是不能说从第二行一直按退格键到第一行。后来在一个群友的帮助下解决了该问题，解决方法如下：  

        1. vim缺省是和vi兼容的，设置成不兼容，在`.vimrc`中添加`set nocompatible`  
        2. vim的backspace有几种工作方式，默认是和vi兼容的，同样需要修改，在`.vimrc`中添加`set backspace=indent,eol,start`  

        (a) indent：如果使用了set indent等自动缩进，想用退格键将缩进字段删掉，必须设置这个选项，否则vim不响应退格  
        (b) eol：如果在INSERT模式下，在行头想通过退格键合并两行，需要设置这个选项  
        (c) start：要想删除在此次插入前的输入，需要设置这个选项  

ok，大功告成，可以尝试下新版本的vim了，顺便体验下自动补全神器YouComPleteMe~
