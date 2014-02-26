---
layout: home
---

<div class="index-content project">
    <div class="section">
        <ul class="artical-cate">
            <li><a href="/"><span>Blog</span></a></li>
            <li><a href="/life"><span>Life</span></a></li>
            <li class="on"><a href="/project"><span>Project</span></a></li>
        </ul>

        <div class="cate-bar"><span id="cateBar"></span></div>

        <ul class="artical-list">
        {% for post in site.categories.project %}
            <li itemscope itemtype="http://schema.org/Article">
                <h2>
                    <a href="{{ post.url }}" itemprop="url">{{ post.title }}</a>
                </h2>
                <div class="title-desc" itemprop="description">{{ post.description }}</div>
            </li>
        {% endfor %}
        </ul>
    </div>

    <div class="aside"></div>
</div>
