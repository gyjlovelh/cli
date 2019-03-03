/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-27 22:36:17
 * @LastEditTime: 2019-03-02 16:06:24
 */

const fss = require('fs-extra');
const path = require('path');
const cp = require('child_process');
const log = require('../../util/logger');
const appConfig = require('../../util/app-config');

const identifier = '[启动] ';

function serve() {
    // 写入国际化配置
    const targetPath = `${appConfig.runtimePath}/${appConfig.selectedSub}/framework`;
    
    // 开启文件改动监听
    log.info(identifier, cp.execSync(`ng serve`, {cwd: targetPath, shell: 'cmd.exe'}).stdout);

    
}

module.exports = {
    serve
};
