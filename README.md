[TOC]



###  bss_cli脚手架

------



``` npm
npm install @bss_cli/ng -g
```

##### 概述

> @bss_cli/ng 是基于angular6 + ng-zorro开发的一个快速开发平台。提供前端架构模板以及通用业务代码快捷生成方式；



##### 命令大全

| 命令    | 参数 | 描述                                                         | 补充                                                       |
| :------ | ---- | :----------------------------------------------------------- | ---------------------------------------------------------- |
| init    | --   | 初始化命令，根据命令当前目录下的application.json，生成应用骨架结构，包括开发目录，编译目录； |                                                            |
| install |      | 重新安装编译目录所有依赖；                                   | 如果安装公共模块或者业务模块失败时，需要首先发布一次版本； |
| update  |      | 更新开发目录中代码到编译目录中；                             |                                                            |
| serve   |      | 启动子应用；                                                 |                                                            |
| publish |      | 发布应用到私服；                                             |                                                            |
| ls      |      | 查看所有自应用，并可以通过上下键切换自应用；                 |                                                            |
| create  |      | 根据命令当前目录下的setting.json文件，生成对应模板代码；     |                                                            |

##### 开发目录结构

```ts
|- applicationName[blog]            	// 应用工程名[代码根目录],例如别名为blog
	|- application.json				// 应用配置文件
	|- common						// 公共组件/服务/顶层模块等
		|- component				// 公共组件，例如表格
			|- grid					// 发布为 @blog_common_component/grid
				|- src
					|- component
						|- grid.component.ts // 
					|- grid.module.ts // 表格组件木块
		|- module					// 公共模块，如登陆/导航/面包屑等
			|- login				// 发布为 @blog_common_module/login
				|- src
					|- login.component.ts	
					|- login.module.ts	// 登陆模块
		|- service					// 公共服务，例如国际化服务
			|- i18n					// 发布为 @blog_common_service/i18n
				|- src
					|- service
						|- i18m.service.ts // 国际化服务
					|- i18n.module.ts	// 国际化服务模块
			|- ...
		|- resource 				// 目前只存放common工程国际化文件
			|- i18n
				|- i18n.xlxs		// 国际化文件
				
	|- bizModule [article]					// 子应用模块，例如叫 article
		|- module						// 发布为 @blog_module/article
			|- src
				|- article.component.ts
				|- article.module.ts
				|- article-routing.module.ts
			|- package.json
		|- shared						// 发布为 @blog_shared/article
		|- resource						// 此目录文件发生变更时不触发热加载
			|- i18n
				|- i18n.xlxs
			|- config
				|- http.json			// 开发环境联调配置
				|- websocket.json		// websock配置
			|- scss						// 发布为 @blog_resource/article
				|- src
					|- global.scss
```



