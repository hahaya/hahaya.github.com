---
layout: post
title: 使用cJSON解析JSON数据
description: 由于最近工作中会使用到JSON，而之前从没有使用过JSON，故抽时间看了下JSON，并使用cJSON解析JSON格式的数据
category: blog
tags: c
published: true
---

## 一 JSON简介 ##
JSON(JavaScript Object Notation)是一种轻量级的数据交换格式，可以把JSON的结构理解成无序的、可嵌套的key-value键值对集合，这些key-value键值对以结构体或数组的形式来组织的。同一级的key-value键值对之间用一个,(逗号)隔开，每个key-value键值对是由一个key后面紧接一个:(冒号)，冒号后面是这个key对应的value。key是一个word，由大小写字母、下划线及数字组成，可以由双引号封闭，也可以不用双引号。而value的取值集为:number、boolean(true、false)、null、string、object和array。更多关于JSON的介绍，请自行google~

## 二 cJSON简介 ##
关于JSON的解析我使用的库是cJSON，cJSON是C语言写的一个JSON解析库，项目地址[http://sourceforge.net/projects/cjson/](http://sourceforge.net/projects/cjson/),用起来比较简单、方便，在test.c文件中有很多使用的例子，如果不明白使用方法可以看看cJSON.h和cJSON.c，不是太深奥，实际上使用一个双链表来记录JSON数据，然后对这个双链表进行增删改查等操作。  
下面就使用一个简单的例子来演示如何使用cJSON,假设有一个名为test的文件，其中的内容如下：  

        {  
            "name":"EVDI",  
            "data":{  
                "id":1,  
                "username":"hahaya",  
                "userpass":"123456",  
                "version"  
            }  
        }  

## 三 cJSON使用 ##
{%highlight c%}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include "cJSON.h"  //需要把该头文件放在后面包含  否则会找不到size_t

//解析JSON
void parse_json(const char *filename)
{
    printf("----------------parse json start-------------------------------\n");
    
    //从文件中读取要解析的JSON数据
    FILE *fp = fopen(filename, "r");
    fseek(fp, 0, SEEK_END);
    long len = ftell(fp);
    fseek(fp, 0, SEEK_SET);

    char *data = (char*)malloc(len + 1);
    fread(data, 1, len, fp);
    fclose(fp);
    printf("%s", data);

    //解析JSON数据
    cJSON *root_json = cJSON_Parse(data);    //将字符串解析成json结构体
    if (NULL == root_json)
    {
        printf("error:%s\n", cJSON_GetErrorPtr());
        cJSON_Delete(root_json);
        return;
    }

    //"name":"EVDI"
    cJSON *name_json = cJSON_GetObjectItem(root_json, "name");
    if (name_json != NULL)
    {
        char *name = cJSON_Print(name_json);    //将JSON结构体打印到字符串中 需要自己释放
        printf("name:%s\n", name);
        free(name);
    }

    //"data":"..."
    //id
    cJSON *data_json = cJSON_GetObjectItem(root_json, "data");
    int id = cJSON_GetObjectItem(data_json, "id")->valueint;
    printf("id:%d\n", id);
    //username
    char *username = cJSON_Print(cJSON_GetObjectItem(data_json, "username"));
    printf("username:%s\n", username);
    free(username);
    //userpass
    char *userpass = cJSON_Print(cJSON_GetObjectItem(data_json, "userpass"));
    printf("userpass:%s\n", userpass);
    free(userpass);
    //version
    char *version = cJSON_Print(cJSON_GetObjectItem(data_json, "version"));
    printf("version:%s\n", version);
    free(version);

    free(data);
 
    printf("----------------parse json end--------------------------------\n");
}

//创建JSON
void create_json()
{
    printf("----------------create json start-----------------------------\n");
    //组JSON
    cJSON *root_json = cJSON_CreateObject();
    cJSON_AddItemToObject(root_json, "name", cJSON_CreateString("EVDI"));
    cJSON *data_json = cJSON_CreateObject();
    cJSON_AddItemToObject(root_json, "data", data_json);
    //添加的另一种方式:cJSON_AddNumberToObject(data_json, "id", 1);通过源码发现仅仅是对cJSON_AddItemToObject的define
    cJSON_AddItemToObject(data_json, "id", cJSON_CreateNumber(1));
    //添加的另一种方式:cJSON_AddStringToObject(data_json, "username", "hahaya");
    cJSON_AddItemToObject(data_json, "username", cJSON_CreateString("hahaya"));
    cJSON_AddItemToObject(data_json, "userpass", cJSON_CreateString("123456"));
    cJSON_AddItemToObject(data_json, "version", cJSON_CreateString("1.0"));

    //打印JSON
    char *out = cJSON_Print(root_json);
    printf("%s\n", out);
    free(out);
    printf("----------------create json end-------------------------------\n");
}

int main()
{
    parse_json("test");
    create_json();
    return 0;
}
{%endhighlight%}
