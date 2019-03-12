#### 简介

> 在使用bss开发应用时，需要给予产品的初始化环境。如产品的工作、编译以及归档目录，已经同步产品的各个子应用信息；

##### 使用方式

> 在任意路径都可以执行 bss init

```shell
➜  ~ bss init
```

> 输出产品的工作目录，此目录下需要有application.json配置产品初始化信息；
>
> 在windows操作系统，默认工作目录为 d:/workspace/sourceCode
>
> 在macOs操作系统，默认工作目录为：/Users/guanyj/workspace/sourceCode

```shell
[init] [info] 当前操作为Darwin
? 请输入产品工作空间路径 (/Users/guanyj/workspace/sourceCode) 
```

> 编译目录以及归档目录需要在application.json中配置；

```js
{
    "name": "hibiscus",  // 产品名
    "production": "hbs", // 产品简写
    "version": "1.0.0", // 版本
    "runtimePath": "/Users/guanyj/workspace/runtime", // 编译目录
    "distPath": "/Users/guanyj/workspace/dist", // 归档目录
    "subs": [ // 子应用配置
        {
            "name": "manage_project",
            "modules": [
                {"name": "user-manage"},
                {"name": "department_manage"}
            ]
        },
        {
            "name": "task-project",
            "modules": [
                {"name": "current"},
                {"name": "history"}
            ]
        },
        {
            "name": "topology"
        }
    ]
}
```

