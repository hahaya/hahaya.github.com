---
layout: post
title: Cracking the Coding Interview --- Q1.3
summary: 学习《Cracking the Coding Interview》的第三天，继续~
categories: [algorithm]
tags: [algorithm]
published: true
---

# {{page.title}} #
{{page.summary}}  

### 一、题目 ###
原文:  
Design an algorithm and write code to remove the duplicate characters in a string without using any additional buffer. NOTE: One or two additional variables are fine. An extra copy of the array is not.  
FOLLOW UP  
Write the test cases for this method.  
译文:
不使用额外的缓存空间，设计算法并写出代码移除字符串中的重复字符.(注意:可以使用额外的一到二个变量，但不允许额外的再开一个数组拷贝)  
进一步的  
为你的程序写测试代码  

### 二、解答 ###
**key point**:这道题就是需要你移除字符串中的重复字符，在答题之前可以向面试官问清楚，不允许一个额外的数组拷贝是指不允许开一个数组，还是可以开一个固定大小的数组。

##### 不使用额外的数组 #####
如果不允许额外再开一个数组，只能用额外的一到两个变量。我们可能会很容易想到一个解法：依次访问字符串中的每个元素，然后再使用这个元素和字符串中的其他元素比较，看是否有重复，如果有重复则去掉或者置标志位(我使用的是讲字符串中后面出现的重复字符置为'\0'),因为字符串可能是C风格字符串或者C++标准库字符串，所以这里我分别实现传入的参数是C风格字符串和C++标准库字符串，代码实现如下：  

{%highlight c++%}
void removeDuplicate1(char *str)
{
    int len = strlen(str);

    if ( len < 2 )
        return;

    int index = 0;  //在当前字符串上进行移除操作 记录移除后字符串长度
    for ( int i = 0; i < len; ++i ) //从当前i的下一位开始匹配
    {
        if ( str[i] != '\0' )   //每比较一次字符可能会改变字符串 所以此时的'\0'可能并不是结尾
        {
            str[index++] = str[i];
            for ( int j = i + 1; j < len; j++ )
            {
                if ( str[i] == str[j] )
                    str[j] = '\0';  //将字符串中当前字符后面出现的重复字符置为'\0'
            }
        }
    }
    str[index] = '\0';  //C风格字符串结尾
}

std::string removeDuplicate2(std::string &str)
{
    int len = str.length();
    if ( len < 2 )
        return str;

    std::string temp = "";
    for ( int i = 0; i < len; ++i )
    {
        if ( str[i] != '\0' )
        {
            temp += str[i];
            for ( int j = i + 1; j < len; ++j )
            {
                if ( str[i] == str[j] )
                    str[j] = '\0';
            }
        }
    }

    return temp;
}
{%endhighlight%}  
上面的算法中使用了两层for循环，故算法的时间复杂度为O(n*n)。

##### 允许开辟一个固定大小的数组 #####
如果允许开辟一个固定大小的数组，假设字符串中的每一个字符都是ASCII字符，聪明的你肯定会想到使用Q1.1中类似的方法，使用一个数组来表征每个字符时候出现。因为字符串可能是C风格字符串或者C++标准库字符串，所以这里我分别实现传入的参数是C风格字符串和C++标准库字符串，代码实现如下：  


{%highlight c++%}
void removeDuplicate3(char *str)
{
    int len = strlen(str);
    if ( len < 2 )
        return;

    bool checker[256];
    memset(checker, 0, sizeof(checker));    //初始化数组为false

    int index = 0;
    for ( int i = 0; i < len; ++i )
    {
        if ( !checker[str[i]] )
        {
            str[index++] = str[i];
            checker[str[i]] = true;
        }
    }
    str[index] = '\0'; //C风格字符串结尾
}

std::string removeDuplicate4(std::string &str)
{
    int len = str.length();
    if ( len < 2 )
        return str;

    bool checker[256];
    memset(checker, 0, sizeof(checker));  //初始化数组为false

    std::string temp = "";

    for ( int i = 0; i < len; ++i )
    {
        if ( !checker[str[i]] )
        {
            temp += str[i];
            checker[str[i]] = true;
        }
    }
    return temp;
}
{%endhighlight%}  
在上面的算法中只使用了一个for循环，所以该算法的时间复杂度为O(n),但是空间的使用量和字符串长度有关，故该算法的空间复杂度也为O(n)，和Q1.1中一样我们也可以通过位操作来降低空间复杂度，代码实现如下：  
 
{%highlight c++%}
void removeDuplicate5(char *str)
{
    int len = strlen(str);
    if ( len < 2 )
        return;

    int checker[8];
    memset(checker, 0, sizeof(checker)); //初始化数组为false

    int index = 0;
    for ( int i = 0; i < len; ++i )
    {
        int value = (int)(str[i]);
        int row = value/32;
        int column = value%32;
        if ( !(checker[row] & (1<<column)) )    //扫描整个字符串 重新拼接字符串 只将没有重复的字符放入字符串中
        {
            str[index++] = str[i];
            checker[row] |= (1<<column);
        }
    }
    str[index] = '\0';  //C风格字符串结尾
}

std::string removeDuplicate6(std::string &str)
{
    int len = str.length();
    if ( len < 2 )
        return str;

    int checker[8];
    memset(checker, 0, sizeof(checker));

    std::string temp = "";
    for ( int i = 0; i < len; ++i )
    {
        int value = (int)(str[i]);
        int row = value/32;
        int column = value%32;
        if ( !(checker[row] & (1<<column)) )
        {
            temp += str[i];
            checker[row] |= (1<<column);
        }
    }
    return temp;
}
{%endhighlight%}  
当然我们可以考虑更简单的情况，字符集是'a'-'z'，不考虑大写字母，字母最多就26个，那么32位系统上一个int变量完全可以表征每个字母的出现情况，同样能做到时间复杂度为O(n)，并且不需要额外的开辟一个数组，所以这种实现方式应该归结为不使用额外的数组，实现代码如下：  

{%highlight c++%}
void removeDuplicate7(char *str)
{
    int len = strlen(str);
    if ( len < 2 )
        return;

    int checker = 0;
    int index = 0;
    for( int i = 0; i < len; ++i )
    {
        int value = (int)(str[i] - 'a');
        if ( !(checker & (1<<value)) )  //扫描整个字符串 重新拼接字符串 只将没有重复的字符放入字符串中
        {
            str[index++] = str[i];
            checker |= (1<<value);
        }
    }
    str[index] = '\0';  //C风格字符串结尾
}

std::string removeDuplicate8(std::string &str)
{
    int len = str.length();
    if ( len < 2 )
        return str;

    int checker = 0;
    std::string temp = "";
    for ( int i = 0; i < len; ++i )
    {
        int value = (int)(str[i] - 'a');
        if ( !(checker & (1<<value)) )
        {
            temp += str[i];
            checker |= (1<<value);
        }
    }
    return temp;
}
{%endhighlight%}

### 三、测试 ###
测试时主要考虑一下几种情况：  
1. 不包含重复字符的字符串，比如"abcd"
2. 字符串全是重复字符，比如"aaaaa"
3. 空字符串
4. 重复字符连续出现的字符串，比如"aaaabbbb"
5. 重复字符不连续出现的字符串，比如"abababab"

### 四、总结 ###
{%highlight c++%}
std::string test1 = "hahaya";
test1[2] = '\0';
std::cout << test1 << std::endl;

std::string test2 = "ha\0aya";
std::cout << test2 << std::endl;
{%endhighlight%}  
考虑上面两种情况的输出，第一种情况下输出`ha aya`，第二种情况会输出`ha`。是什么原因造成这种情况的呢？是因为std::string并不以字符'\0'标明字符串结尾，而C风格字符串则以'\0'结尾。所以第一种情况下输出的是`ha aya`，而在第二种情况下，是以一个C风格字符串初始化一个std::string，而C风格字符串以'\0'结尾，所以是以"ha\0"初始化std::string的，所以第二种情况下输出的是`ha`。  
通过上面的小例子，我们很容易想到当传入的参数是std::string时，发现重复字符时，不能简单的将那个字符置为'\0'，所以我是使用了一个std::string temp;来记录去掉没有重复字符的字符串。

### 五、链接 ###
全书解题目录:  
[http://hahaya.github.io/2013/12/26/Cracking-the-Coding-Interview.html](http://hahaya.github.io/2013/12/26/Cracking-the-Coding-Interview.html)  
全书代码:  
[https://github.com/hahaya/Cracking_the_Coding_Interview](https://github.com/hahaya/Cracking_the_Coding_Interview)  
本题代码:  
[https://github.com/hahaya/Cracking_the_Coding_Interview/blob/master/code/1.3.cpp](https://github.com/hahaya/Cracking_the_Coding_Interview/blob/master/code/1.3.cpp)