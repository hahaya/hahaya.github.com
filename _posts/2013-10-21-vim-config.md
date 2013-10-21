---
layout: post
title: vim配置
summary: 最近整理vim的配置，换上了vim插件的管理神器`vundle`，顿时.vim目录变得很干净、清晰，`vundle`使用git来管理插件、一键更新，从此一个`.vimrc`走天下，我的配置托管在GitHub这里[https://github.com/hahaya/hahaya-vim](https://github.com/hahaya/hahaya-vim),妈妈再也不用担心我的vim配置了~
categories: [vim]
tags: [vim]
published: true
---

# {{ page.title }} #
{{ page.summary }}

### 安装、使用hahaya-vim ###
hahaya-vim的安装和使用很简单，只需在终端中依次执行如下命令：  

        git clone https://github.com/gmarik/vundle.git ~/.vim/bundle/vundle  
        git clone https://github.com/hahaya/hahaya-vim.git ~/hahaya-vim
        cd ~/hahaya-vim
        cp .vimrc ~/.vimrc
        vim
        :BundleInstall(在vim命令模式下执行)

###### 备注 ######  
1. `.vimrc`在linux下是隐藏文件  
2. YouCompleteMe插件需要编译才能使用，参考我之前的文章，飞机票[http://hahaya.github.io/2013/07/29/build-YouCompleteMe.html](http://hahaya.github.io/2013/07/29/build-YouCompleteMe.html)  

### 使用到的插件 ###
1. [vundle](https://github.com/gmarik/vundle) --- vim插件管理神器.  
2. [vim-powerline](https://github.com/Lokaltog/vim-powerline) --- create better-looking vim statuslines.  
3. [The-NERD-tree](https://github.com/vim-scripts/The-NERD-tree) --- allow you explore your filesystem and to open files and directories.  
4. [tagbar](https://github.com/majutsushi/tagbar) --- browse the tags of source code files.  
5. [a.vim](https://github.com/vim-scripts/a.vim) --- quick switch between source files and header files.  
6. [ctrlp.vim](https://github.com/kien/ctrlp.vim) --- Full path fuzzy file,buffer,tag...finder for vim.  
7. [delimitMate](ttps://github.com/Raimondi/delimitMate) --- provides automatic closing of quotes,parenthesis,brackets and so on.  
8. [solarized](https://github.com/altercation/vim-colors-solarized) --- solarized colorscheme for vim.  
9. [molokai](https://github.com/tomasr/molokai) --- molokai colorscheme for vim.  
10. [indentLine](https://github.com/Yggdroot/indentLine) --- display thin vertical lines at each indentation level for code indented with spaces.  
11. [vim-trailing-whitespace](https://github.com/bronson/vim-trailing-whitespace) --- this plugin causes all trailing whitespace to be highlighted in red.  
12. [vim-markdown](https://github.com/plasticboy/vim-markdown) --- syntax highlighting,matching rules and mappings for markdown.  
13. [vim-golang](https://github.com/jnwhiteh/vim-golang) --- vim plugins for golang.  
14. [YouCompleteMe](https://github.com/Valloric/YouCompleteMe) --- a code completion engine for vim.

### 参考文章 ###
1. 使用vundle管理vim插件:[http://hahaya.github.io/2013/07/26/use-vundle.html](http://hahaya.github.io/2013/07/26/use-vundle.html)  
2. Ubuntu 12.04下编译Vim:[http://hahaya.github.io/2013/07/25/build-vim-on-ubuntu.html](http://hahaya.github.io/2013/07/25/build-vim-on-ubuntu.html)  
3. Linux下编译YouCompleteMe插件:[http://hahaya.github.io/2013/07/29/build-YouCompleteMe.html](http://hahaya.github.io/2013/07/29/build-YouCompleteMe.html)
