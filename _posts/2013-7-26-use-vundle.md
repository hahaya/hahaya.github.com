---
layout: post
title: 使用vundle管理vim插件
summary: 用过一段时间的原生态vim，然后配置各种插件，最后.vim目录越来越大，内容越来越多，很杂很乱，管理起来非常麻烦，后来偶遇vim插件管理神器vundle，于是就重新折腾了一下vim配置，接下来就有了本文~
categories: [vim]
tags: [vim]
published: true
---

# {{ page.title }} #
最近一段时间又偷懒了，好久没有更新文章了，好久没学习了，周末和同时Dota去了，趁现在有学习的动力更新一篇文章...  
{{ page.summary }}  
vundle是vim bundle的简写，是vim插件管理的神器，更新方便、支持搜索、一键更新，从此只需要一个vimrc走天下，为了见识下到底有多厉害，废话不多说，操刀动工...



### 一、安装vundle ###
		
		git clone https://github.com/gmarik/vundle.git ~/.vim/bundle/vundle

### 二、如何通过vundle安装插件 ###
1. vim-scripts仓库中的插件，可以直接使用`Bundle 'L9'`这样的格式配置  
2. github上其他用户的插件，使用`Bundle 'hahaya/hahaya-vim.git'`这样用户名加仓库名的方式配置(自己的插件全部使用这种方法配置)  

### 三、vundle命令 ###
- :BundleList			-列举出列表中(.vimrc中)配置的所有插件
- :BundleInstall		-安装列表中全部插件
- :BundleInstall!		-更新列表中全部插件
- :BundleSearch foo		-查找foo插件
- :BundleSearch! foo		-刷新foo插件缓存
- :BundleClean			-清除列表中没有的插件
- :BundleClean!			-清除列表中没有的插件

### 四、配置.vimrc ###
上面已经解释了vundle的简单用法，下面配置.vimrc，然后介绍如何通过vundle管理插件，先在终端下执行`vim ~/.vimrc`命令，如果存在.vimrc则打开，不存在.vimrc则创建一个.vimrc并打开。在.vimrc中加入一些常用配置，我的.vimrc如下：  

{%highlight vim%}
"====================================
"    FileName:	.vimrc
"    Author: 	hahaya
"    Version:	1.0.0
"    Email:	hahayacoder@gmail.com
"    Blog:	http://hahaya.github.com
"    Date:	2013-7-23
"=============================================



"==================================
"    Vim基本配置
"===================================

"关闭vi的一致性模式 避免以前版本的一些Bug和局限
set nocompatible
"配置backspace键工作方式
set backspace=indent,eol,start

"显示行号
set number
"设置在编辑过程中右下角显示光标的行列信息
set ruler
"当一行文字很长时取消换行
"set nowrap

"在状态栏显示正在输入的命令
set showcmd

"设置历史记录条数
set history=1000

"设置取消备份 禁止临时文件生成
set nobackup
set noswapfile

"突出现实当前行列
"set cursorline
"set cursorcolumn

"设置匹配模式 类似当输入一个左括号时会匹配相应的那个右括号
set showmatch

"设置C/C++方式自动对齐
set autoindent
set cindent

"开启语法高亮功能
syntax enable
syntax on

"指定配色方案为256色
set t_Co=256

"设置搜索时忽略大小写
set ignorecase

"设置在Vim中可以使用鼠标 防止在Linux终端下无法拷贝
set mouse=a

"设置Tab宽度
set tabstop=4
"设置自动对齐空格数
set shiftwidth=4
"设置按退格键时可以一次删除4个空格
set softtabstop=4
"设置按退格键时可以一次删除4个空格
set smarttab
"将Tab键自动转换成空格 真正需要Tab键时使用[Ctrl + V + Tab]
set expandtab

"设置编码方式
set encoding=utf-8
"自动判断编码时 依次尝试一下编码
set fileencodings=ucs-bom,utf-8,cp936,gb18030,big5,euc-jp,euc-kr,latin1



"检测文件类型
filetype on
"针对不同的文件采用不同的缩进方式
filetype indent on
"允许插件
filetype plugin on
"启动智能补全
filetype plugin indent on
{%endhighlight%}

### 五、使用vundle安装插件 ###
前面已经介绍了.vimrc的基本配置，那么该怎么使用vundle来管理vim插件呢，在.vimrc中添加如下内容启用vundle管理vim插件的功能，并使用vundle来配置一个名为vim-powline的状态栏加强插件  

{%highlight vim%}
"开始使用Vundle的必须配置
set nocompatible
filetype off
set rtp+=~/.vim/bundle/vundle/
call vundle#rc()

"使用Vundle来管理Vundle
Bundle 'gmarik/vundle'

"PowerLine插件 状态栏增强展示
Bundle 'Lokaltog/vim-powerline'
"vim有一个状态栏 加上powline则有两个状态栏
set laststatus=2
set t_Co=256
let g:Powline_symbols='fancy'

"Vundle配置必须 开启插件
filetype plugin indent on
{%endhighlight%}  

保存.vimrc文件，然后重新打开一个vim，在NORMAL模式下输入命令`:BundleInstall`,首次执行会要求输入github帐号和密码，等待插件下载完成，然后重新启动vim就会看见漂亮的状态栏插件~  

### 六、使用vundle更新插件 ###
使用vundle更新插件非常简单，只用打开一个vim，然后在NORMAL模式下输入命令`:BundleInstall!`  

### 七、使用vundle卸载插件 ###
使用vundle卸载插件也很简单，只需在.vimrc去掉绑定插件的命令及插件的配置(注释掉即可，以免以后会使用)，假如需要卸载`vim-powerline`这个插件，首先在.vimrc中注释掉以下内容：  

{%highlight vim%}
Bundle 'Lokaltog/vim-powerline'
"vim有一个状态栏 加上powline则有两个状态栏
set laststatus=2
set t_Co=256
let g:Powline_symbols='fancy'
{%endhighlight%}

保存.vimrc文件，重新打开一个vim，在NORMAL模式下输入命令`:BundleClean`,打开`~/.vim/bundle`已经看不到插件`vim-powerline`的相关文件，是不是很方便~  


ps:粗心大意将`set rtp+=~/.vim/bundle/vundle/`中的rtp写成rpt，然后.vimrc中一直提示错误，然后查错误查了半天，很郁闷，找了好久才发现是单词拼写错误。
