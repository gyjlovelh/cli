const fs = require('fs');
const {execSync} = require('child_process');
const {mkdirSyncSafe, writeFileSyncSafe} = require('./fs-util');


/**
 * 切换子应用并初始化
 * 
 * @param {object} application
 * @param {string} name 
 */
function useFramework(application, name) {
    const frameworkPath = `${application.runtimePath}/waf-${name}`;
    mkdirSyncSafe(application.runtimePath);
    mkdirSyncSafe(frameworkPath);
    // 初始化runtime环境
    if (!fs.existsSync(`${frameworkPath}/framework/package.json`)) {
        execSync(`ng new framework --skip-install --style=scss --skip-tests --prefix ${name}`, {cwd: frameworkPath});
        // 修改framework模块

        /**
         * 在package.json中追加依赖
         * 1, 第三方依赖
         * 2, 公共依赖
         * 3, 业务模块
         */
        

    }
    let packageJson = fs.readFileSync(`${frameworkPath}/framework/package.json`, {encoding: 'utf8'}).toString();
    packageJson = JSON.parse(packageJson);
    if (!packageJson.dependencies.hasOwnProperty(`@waf-modules/waf-${name}`)) {
        packageJson.dependencies[`@waf-modules/waf-${name}`] = '^1.0.0';
    }

    fs.writeFileSync(`${frameworkPath}/framework/package.json`, JSON.stringify(packageJson, null, 4), {flag: 'w'});
    console.log('[use] user child framework' + name);
}

module.exports = {
    useFramework
}
