##### 简介

> install 会到私服库中，根据package.json的依赖下载，由于使用`bss ls`设置了当前开发使用的子应用，所以在全局执行`bss install`时会安装当前子应用的依赖。
>
> 包括angular-cli默认的依赖 + 子应用module/package.json中的依赖 + 子应用shared/package.json中的依赖 

##### 使用方式

```shell
➜  ~ bss install
```

##### 使用场景

> 当产品代码从git或者svn更新下载下来后，此时在编译环境中是没有node_modules目录的，需要全局执行此命令下载依赖包；