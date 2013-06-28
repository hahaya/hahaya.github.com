---
layout: post
title: 使用Github Pages搭建个人独立博客
summary: Github是一个伟大的发明，使用Github Pages很容易搭建一个个人博客，接下来一步一步搭建属于自己的独立博客，希望能给你一些帮助。
categories: [jekyll]
tags: [jekyll]
published: true
---

# {{ page.title }} #

{{page.summary}}

### Github上搭建博客的优缺点 ###
		Github博客优点:
		1. 轻量级博客系统，不需要太麻烦的配置
		2. 使用标记语言，不然Markdown
		3. 无需自己搭建服务器
		4. 可以绑定自己的域名
		
		Github博客缺点:
		1. 使用jekyll博客系统，相当于静态页发布，动态部分相当局限
		2. 基于Git，许多东西需要自己动手，没有Wordpress等那样强大的后台
		

### 前提 ###
要在GitHub上搭建博客，起码得有一个[GitHub](https://github.com)账号，没有的同学就去注册一个吧。要上传代码到GitHub就需要会简单使用Git，不会的同学也可以学学。

### GitHub ###
GitHub是个神奇的发明，将代码和社区联系在一起。GitHub是现在最流行的代码仓库，很多大公司将项目放在上面，为了使项目更方便的被人理解，当然少不了介绍页面，甚至会需要完整的文档站。Github替你想到了这一点，它提供了个人主页和项目主页两种服务。  

### 个人主页和项目主页 ###
个人主页：Github为每一个用户分配了一个二级域名`username.github.com`，用户为自己的二级域名创建主页很简单，只需要在Github下创建一个名为`username.github.com`的版本库，并向其master分支提交网站静态页面即可，其中网站首页为index.html。  
项目主页：为项目启用项目主页很简单，只需要在项目版本库中创建一个名为`gh-pages`的分支，并向其中添加静态网页即可，通过网址`http://username.github.com/helloworld`（假设项目名为helloworld）访问。  


### 使用Github Pages功能创建个人博客 ###
1. 登陆Github，创建一个名为`hahaya.github.com`的版本库（注意将hahaya替换成自己的Github账户名）。
2. 点击Setting，选择一个自己喜欢的模板，最后点击发布public按钮。
3. 耐心等待一段时间（不超过10分钟），登陆`http://username.github.com`，会发现自己的个人博客已经生成。


### 使用其他模板创建个人博客 ###
1. 执行如下命令克隆`hahaya.github.com`版本库到本地  

		git clone git@github.com:hahaya/hahaya.github.com.git
2. 删除Github自动生成的文件,注意不要删除.git目录  

		cd hahaya.github.com		
		git rm -r images/
		gir rm -r index.html
		git rm -r javascripts/
		git rm -r params.json
		gir rm -r stylesheets/
		git commit -m "remove files"
		git push  
3. 下载别人的博客模板，然后删除其中的.git目录，然后将内容全部复制到自己的博客目录中  

4. 向Github提交修改后的博客  
		
		cd hahaya.github.com
		git add .
		git commit -m "add blog files"
		git push

5. 耐心等待一段时间后，再次打开网址`http://hahaya.github.com`看看博客变样了没~

### 本地预览博客 ###
1. 在下载了别人的博客模板后，经过自己的修改，上传到Github后，不能生成对应的网页，有可能是修改得不正确。如果不确定自己修改得是否正确，那么就需要自己在本地预览，确保没有错误后再上传到Github。  

2. 想要本地预览，就需要使用jekyll生成静态网站，在终端下执行下面的命令安装jekyll,当然先需要安装jekyll的依赖包。  

		sudo apt-get install ruby1.9.1-dev
		sudo apt-get install rdiscount
		sudo apt-get install RedCloth
		sudo apt-get install jekyll

3. 使用jekyll创建网站，会在网站根目录下生成_site目录，上传到Github中时，请先删除_site目录。生成成功后，使用jekyll作为内置的Web服务器（默认在端口4000开启Web服务）

		cd hahaya.github.com
		jekyll build	
		jekyll server

4. 在浏览器中输入`http://localhost:4000`查看自己修改后的网站。  
  
  
  

