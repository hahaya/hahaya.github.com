---
layout: post
title: Cracking the Coding Interview --- Q1.1
summary: 终于开始了《Cracking the Coding Interview》这本书的学习，加深对算法的学习，好了，废话不多说开始吧~
categories: [algorithm]
tags: [algorithm]
published: true
---

# {{page.title}} #
{{page.summary}}

### 一、题目 ###
原文:  
Implement an algorithm to determine if a string has all unique characters. What if you can not use additional data structures?  
译文:  
实现一个算法判断一个字符串中的每个字符是否唯一(即判断字符串中时候出现重复字符)，不使用额外的数据结构(只使用基本数据结构)

### 二、解答 ###
**key point**:在你开始解答这个题目之前，你可以问面试官，这个字符串的字符集有多大？是ASCII吗？或者是26个英文字母？因为在不同的情况下，可能会有不解决方案。
##### 字符串的字符全是ASCII #####
在这里我们假设字符串中的字符全是ASCII字符，那么最多就是256个字符了，所以我们完全可以用一个大小为256的bool数组来表示每个ASCII字符是否出现，出现这bool数组对应为的值为true，否则为false。大致的解答思路可以描述为：初始化bool数组为false，遍历字符串中的每一个字符，当bool数组对应位置的值为true，这表明该字符以前出现过，即可得出该字符串中有重复字符。否则将bool数组对应位置的值置为false，进行接下来的循环。代码实现如下：  

{%highlight c++%}
bool isUniqueChar1(const std::string &str)
{
    bool checker[256];
    memset( checker, 0, sizeof(checker) ); //必须将所有位设置成false

    for ( unsigned int i = 0; i < str.length(); ++i )
    {
        int value = (int)str.at(i);
        if ( checker[value] )
        {
            return false;
        }
        checker[value] = true;
    }
    return true;
}
{%endhighlight%}  
由于该算法中使用了一个for循环，故该算法的时间复杂度为O(n)。bool数组的使用量最大为字符串的长度，故空间复杂度也为O(n)。有没有其他方法来降低空间的使用量呢？答案显然是肯定的，我们可以通过位运算来减少空间的使用量，每一位用来表示相应位置字符是否出现。对于ASCII字符集，需要256位，在32位系统上，我们可以用一个长度为8的int数组来代替这256位(32*4*8)。剩下最关键的问题就是如何把每一个ASCII字符映射到相应的位置上去呢？对已字符'a'对应的代码是97，我们应该把数组中的哪一位置1呢？其实很简单，97/32 = 3即得到在数组中对应的下标3，97%32 = 1即得到在int中对应的位1，完整代码如下：  

{%highlight c++%}
bool isUniqueChar2(const std::string &str)
{
    int checker[8];
    memset(checker, 0, sizeof(checker)); //必须将所有位设置成0

    for ( unsigned int i = 0; i < str.length(); ++i )
    {
        int value = (int)str.at(i);
        int row = value/32;
        int colunm = value%32;
        if ( checker[row] & (1<<colunm) )
        {
            return false;
        }
        checker[row] |= (1<<colunm);
    }
    return true;
}
{%endhighlight%}  
其实两种算法的本质是一样的，只不过第一种方法使用bool数组来表示字符时候出现，而第二种方法中使用位来表示字符是否实现。

### 字符串的字符全是英文字母 ###
假设我们要判断的字符串全是英文字母，这里我们只考虑'a' - 'z'的情况，那么最多有26个，直接使用一个int就可以表示所有的字符了。下面给出完整代码：  
{%highlight c++%}
bool isUniqueChar3(const std::string &str)
{
    int checker = 0;    //必须将所有位设置成0

    for ( unsigned int i = 0; i < str.length(); ++i )
    {
        int value = (int)(str.at(i) - 'a' );	//转换成数字0 - 25
        if ( checker & (1<<value) )
        {
            return false;
        }
        checker |= (1<<value);
    }
    return true;
}
{%endhighlight%}  

### 三、总结 ###
通过这个题目会发现位操作可以用来节省空间的使用量，后面我会写一篇文章介绍一些常用的位操作。  

### 四、链接 ###
全书解题目录:  
[http://hahaya.github.io/2013/12/26/Cracking-the-Coding-Interview.html](http://hahaya.github.io/2013/12/26/Cracking-the-Coding-Interview.html)  
全书代码:  
[https://github.com/hahaya/Cracking_the_Coding_Interview](https://github.com/hahaya/Cracking_the_Coding_Interview)  
本题代码:  
[https://github.com/hahaya/Cracking_the_Coding_Interview/blob/master/code/1.1.cpp](https://github.com/hahaya/Cracking_the_Coding_Interview/blob/master/code/1.1.cpp)