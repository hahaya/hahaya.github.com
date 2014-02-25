---
layout: default
title: about
---
<div id="content" class="aboutMe">
<form class="page-loc" method="GET" action="/search">
	<span style="float:right"><input type="text" class="web-search" name ="q" value="站内搜索" /><a href="/atom.xml" class="page-rss" style="margin-left: 20px;">订阅</a></span>
  	hahaya's blog » 关于我
</form>
<dl class="aboutDl">
	<dd><strong>hahaya，</strong>ToSmile</dd>
	<dd><strong>weibo:</strong><a href="http://weibo.com/u/3881658031" target="_blank">@hahaya</a></dd>
	<dd><strong>blog:</strong><a href="http://blog.csdn.net/qiurisuixiang" target="_blank">CSDN-hahaya</a>（本博客文章不同步至CSDN）</dd>
	<dd><strong>email:</strong><a href="mailto:hahayacoder@gmail.com">hahayacoder@gmail.com</a></dd>
	<dd><strong>自述:</strong>苦逼的Qt程序员，对 C/C++、Qt、Golang、Cocos2d-x、Node.js、Server等感兴趣。</dd>

	<dt>关于博客</dt>
	<dd>所有文章非特别说明皆为原创，遵循的协议为「<a href="http://creativecommons.org/licenses/by-nc-sa/3.0/deed.zh" target="_blank">署名-非商业性使用-相同方式共享</a>」，由于文章表述或者内容可能存在诸多错误，所以部分内容会作修改，为保证转载信息与源同步，转载请注明文章出处！谢谢合作 :）</dd>

	<dt>好友链接</dt>
	<dd>
        <div class="friend-link">
            <a href="http://blog.csdn.net/qiurisuixiang" title="http://blog.csdn.net/qiurisuixiang" target="_blank">我的CSDN博客</a>
        </div>
   </dd>
</dl>
{% include disqus.snippet %}
<div class="footer">
    <small>Powered by <a href="https://github.com/mojombo/jekyll">Jekyll</a> | Copyright 2013 - 2023 Designed by <a href="/about.html">hahaya</a> | <span class="label label-info">{{site.time | date:"%Y-%m-%d %H:%M:%S %Z"}}</span></small>
</div>
</div>
<script type="text/javascript">
$(function(){
	$('#disqus_container .comment').trigger('click');
});
</script>
