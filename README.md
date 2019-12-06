[TOC]



###  bss_cli脚手架

------

##### Usage

``` npm
npm install @hibiscus/cli -g
```

##### 概述

> @hibiscus/cli 是基于angular6 + ng-zorro开发的一个快速开发平台。提供前端架构模板以及通用业务代码快捷生成方式；



##### 从头开始一个应用

> 在工作空间中创建application.json。默认位置：d:/workspace/sourceCode
```json
{
    "name": "hibiscus", 
    "production": "hbs",
    "version": "1.0.0",
    "runtimePath": "d:/workspace/runtime",
    "distPath": "d:/workspace/dist",
    "subs": [
        {
            "name": "user-project",
            "modules": [
                {"name": "list"},
                {"name": "detail"}
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
> 初始化

```shell
D:\sourceCode\cli\cli>orchid init
[初始化] [INFO] 当前操作为Windows_NT
? 请输入产品工作空间路径 d:/workspace/sourceCode
[初始化] [INFO] 同步application.json
[app] [INFO] 读取application.json文件.
[render] [INFO] 创建文件d:/workspace/sourceCode/user-project/module/index.ts
[render] [INFO] 创建文件d:/workspace/sourceCode/user-project/module/package.json
...
[render] [INFO] 覆盖文件d:/workspace/runtime/topology/framework/tsconfig.json
[render] [INFO] 覆盖文件d:/workspace/runtime/topology/framework/src/index.html

```

> 切换子应用

```shell
D:\workspace>orchid ls
[app] [INFO] 读取application.json文件.
? 选择子应用
  user-project
  task-project
> topology
```

> 设置npm仓库为私服地址。如http://sinopia:4873;  [设置node-sass地址不在此处叙述；](  https://blog.csdn.net/bug_zero/article/details/65968959 )

```powershell
npm config set registry http://sinopia:4873
```
> 安装依赖。

```shell
D:\sourceCode\cli\cli>orchid install
[app] [INFO] 读取application.json文件.
[install] [INFO] > node-sass@4.11.0 install d:\workspace\runtime\topology\framework\node_modules\node-sass
[install] [INFO] > node scripts/install.js
[install] [INFO] Cached binary found at C:\Users\Administrator\AppData\Roaming\npm-cache\node-sass\4.11.0\win32-x64-57_binding.node
[install] [INFO] > node-sass@4.11.0 postinstall d:\workspace\runtime\topology\framework\node_modules\node-sass
[install] [INFO] > node scripts/build.js
[install] [INFO] Binary found at d:\workspace\runtime\topology\framework\node_modules\node-sass\vendor\win32-x64-57\binding.node
[install] [INFO] Testing binary
[install] [INFO] Binary is fine
[install] [INFO] added 1100 packages in 46.701s
```

> 启动服务

```shell
D:\sourceCode\cli\cli>orchid serve
[app] [INFO] 读取application.json文件.
[copy] [INFO] 复制文件：d:/workspace/sourceCode/topology/resource/config => d:/workspace/runtime/topology/framework/src/assets/config
[render] [INFO] 覆盖文件d:/workspace/runtime/topology/framework/src/styles.scss
[serve] [INFO] 引入全局样式成功d:/workspace/runtime/topology/framework/src
[serve] [INFO] 国际化文件配置成功d:/workspace/runtime/topology/framework/src/assets/i18n
...
```

##### 命令大全

- [Init](/bin/commands/init/readme.md)
- [Install](/bin/commands/install/readme.md)
- [update](/bin/commands/update/readme.md)
- [serve](/bin/commands/serve/readme.md)
- [publish](/bin/commands/publish/readme.md)
- [ls](/bin/commands/ls/readme.md)
- [new](/bin/commands/new/readme.md)
- [add](/bin/commands/add/readme.md)

##### 开发目录结构

```tex
|- sourceCode/                              工作目录
|   |- application.json                     应用配置文件
|   |- common/                              app产品公共层
|   |   |- module/                          产品公共功能模块
|   |   |   |- login/
|   |   |- component/                       产品公共组件模块
|   |   |   |- grid/
|   |   |- service/                         产品公共服务模块
|   |   |   |- http/
|   |   |- resource/                        产品公共资源模块
|   |   |   |- i18n/                        公共模块国际化
|   |   |   |   |-i18n.xlsx
|   |   |   |- theme/                       产品主题模块
|   |   |   |- iconfont/                    产品字体图标库
|   |- business/                            子产品目录
|   |   |- module/                          子产品功能模块
|   |   |   |- src/
|   |   |   |   |- child_business/
|   |   |   |   |   |- child_business.component.ts
|   |   |   |   |- business.component.ts
|   |   |   |   |- business.module.ts
|   |   |   |   |- business-routing.module.ts
|   |   |   |- package.json
|   |   |- shared/                          子产品公共模块
|   |   |   |- src/
|   |   |   |   |- shared.module.ts
|   |   |   |- package.json
|   |   |- resource/                        子产品资源模块
|   |   |   |- i18n/
|   |   |   |   |- i18n.xlsx
|   |   |   |- config/                      开发阶段环境配置
|   |   |   |   |- http.json
|   |   |   |   |- websocket.json
|   |   |   |- scss/                        子产品全局样式
|   |   |   |   |- src/
|   |   |   |   |   |- global.scss
|   |   |   |   |- package.json

```



##### 快速生成模板文件 [进行中...]

```shell
orchid create <template> 
```

