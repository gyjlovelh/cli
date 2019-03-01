#!/usr/bin/env node
/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-01 08:51:20
 * @LastEditTime: 2019-03-01 18:31:42
 */
const commander = require('commander');
const {init, ls, serve, install, update} = require('./commands');
// const {createComponent} = require('./create_component');

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

// commander.command('create <component>')
//    .description('生成waf_grid组件')
//    .action(createComponent);

commander.command('ls')
   .description('工程中所有子应用')
   .action(ls);

commander.command('serve')
   .description('启动服务')
   .action(serve);

commander.parse( process.argv );
