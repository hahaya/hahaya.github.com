---
layout: index 
title: hahaya's blog
---

{% for post in site.posts %}
- ### [{{ post.title }}]({{ post.url }}) <time>{{ post.date | date: '%Y-%m-%d'}}</time>

  {{post.summary}}

  [全文阅读 &raquo;]({{ post.url }})
{% endfor %}

