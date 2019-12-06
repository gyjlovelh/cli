##### 简介

> 根据预制模板快速创建组件或者某种业务的基础骨架。如表格、表单、菜单等。为了避免过分重复的编码，同一种bug多次出现，以及更容易实现主题样式的定制，根据业务场景抽象出不同的配置文件；将开发人员从繁重的业务开发中解放出来。

##### 使用方式

> 新建一个临时目录，添加setting.json文件。然后在当前目录打开命令行，执行`orchid new <schema>`命令，会在当前目录下生成对应的代码。

```shell
➜  ~ orchid new grid
```

##### 举例

> 如下是根据表格业务抽象出的配置。可设置表格的分页、过滤、排序以及列的信息；模板的功能满足情况和对业务的分析理解直接相关，业务越是清晰、通用，则模板满足的功能越接近交付要求。

```json
{
    "grid": {
        "sortable": true,
        "filterable": true,
        "checkBoxable": false,
        "columns": [
            {
                "field": "name", 
                "sign": "名称", 
                "width": 200, 
                "title": "app.module.user.list.name"
            },
            {
                "field": "age", 
                "sign": "年龄", 
                "width": 120, 
                "filterType": "numeric", 
                "title": "app.module.user.list.age"
            },
            {
                "field": "birthday",
                "sign": "生日",
                "width": 300,
                "filterType": "date",
                "sortable": "false",
                "title": "app.module.user.list.birthday"
            }
        ]
    }
}
```

