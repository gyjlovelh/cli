#!/usr/bin/env node
/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-01 08:51:20
 * @LastEditTime: 2019-03-08 13:35:51
 */
const commander = require('commander');
const {init, ls, serve, install, update, publish, doNew, doRemove, doAdd} = require('./commands');

commander.version('v1.0.0', '-v --version')
    .allowUnknownOption(false);

commander.command('init')
   .description('初始化WAF本地环境')
   .action(init);

commander.command('install')
    .arguments('[pkgs...]')
    .option('-l --latest', '更新应用模块到最新版本')
    .alias('i')
    .description('安装公共依赖')
    .action(install);

commander.command('add')
    .arguments('<pkgs...>')
    .option('-s --shared', '向shared工程中追加依赖包')
    .description('向当前工程中追加依赖包')
    .action(doAdd);

commander.command('update')
    .description('更新应用代码')
    .action(update);

commander.command('publish')
    .description('发布模块到仓库')
    .action(publish);


commander.command('new <schema> <modName>')
    .description('创建common工程模板')
    .action(doNew);

commander.command('remove <schema> <modName>')
    .description('移除common工程中模板')
    .action(doRemove);

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
