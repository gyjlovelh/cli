#!/usr/bin/env node
/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-01 08:51:20
 * @LastEditTime: 2019-03-04 14:31:34
 */
const commander = require('commander');
const {init, ls, serve, install, update, publish} = require('./commands');

commander.version('v1.0.0', '-v --version');

commander.command('init')
   .description('初始化WAF本地环境')
   .action(init);

commander.command('install')
    .description('安装公共依赖')
    .action(install);

commander.command('update')
    .description('更新应用代码')
    .action(update);

commander.command('publish')
    .description('发布模块到仓库')
    .action(publish);

// commander.command('create <component>')
//    .description('生成waf_grid组件')
//    .action(createComponent);

commander.command('ls')
   .description('工程中所有子应用')
   .action(ls);

commander.command('serve')
    .option('--ip [ip]', '自定义IP')
    .option('--port [port]', '自定义端口', 4200)
    .description('启动服务')
    .action(serve);

commander.parse( process.argv );
