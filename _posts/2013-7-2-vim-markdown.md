---
layout: post
title: Vim中Markdown语法高亮 
summary: 最近将博客搬到了Github上，开始使用Markdown语法写文章，由于是Vim的脑残粉，所以想在Vim下写文章，但是默认Vim并不支持Markdown语法高亮，一番这特折腾后有了本文~
categories: [vim]
tags: [vim]
published: true
---

# {{page.title}} #
{{page.summary}}  
开始在Google中搜索到的很多都是比较古老的设置方式，并且Vim插件下载地址打不开或者版本比较旧。于是继续搜索...

### 安装插件 ###
1. 在Github上下载插件:[https://github.com/plasticboy/vim-markdown](https://github.com/plasticboy/vim-markdown)  

2. 插件的目录结构如下:  

		.
		|-- after
		|   |-- ftplugin
		|   |   |-- mkd.vim
		|-- syntax
		|   |-- mkd.vim
		|-- ftdetect
		|   |-- mkd.vim
		|-- README  

3. 将三个`mkd.vim`分别复制到`~/.vim`对应的`after/ftplugin、syntax、ftdetect`目录下(如果没有这些目录则自己新建)  
		cp ./after/ftplugin/mkd.vim ~/.vim/after/ftplugin
		cp ./syntax/mkd.vim ~/.vim/syntax
		cp ./ftdetect/mkd.vim ~/.vim/ftdetect  
4. 打开`.vimrc`如下内容设置文件后缀名和代码折叠方式  
		au BufRead,BufNewFile *.{md,mdown,mkd,mkdn,markdown,mdwn}   set filetype=mkd
		let g:vim_markdown_folding_disabled=1
5. OK，重新打开一个Markdown文件，看看有木有语法高亮，慢慢享受使用Markdown写文章的乐趣吧。
