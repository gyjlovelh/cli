
const fss = require('fs-extra');
const path = require('path');
const cp = require('child_process');

const log = require('../../util/logger');
const appConfig = require('../../util/app-config');

const identifier = '[安装] ';

function install() {
    try {
        let targetPath = `${appConfig.runtimePath}/${appConfig.selectedSub}/framework`;
        let pkg = fss.readJSONSync(`${targetPath}/package.json`);
        // 补丁：解决 rxjs^6.4.0 转为 ^6.0.0
        pkg.dependencies.rxjs = '^6.0.0';

        let bssPkgs = Object.keys(pkg.dependencies).filter(key => key.includes('@bss')).join(' ');
        let selfDep = Object.keys(pkg.dependencies)
            .filter(key => !key.includes('@bss'))
            .map(key => `${key}@${pkg.dependencies[key]}`).join(' ');

        let devDep = Object.keys(pkg.devDependencies)
            .map(key => `${key}@${pkg.devDependencies[key]}`).join(' ');

        // 指定node-sass的下载源
        log.info(identifier, cp.execSync('npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass'));

        // 安装BSS平台依赖
        log.info(identifier, cp.execSync(`npm install ${bssPkgs} --save --registry http://0.0.0.0:4873`, {cwd: targetPath}));

        log.info(identifier, cp.execSync(`npm install ${selfDep} --save --registry http://registry.npm.taobao.org`, {cwd: targetPath}));

        log.info(identifier, cp.execSync(`npm install ${devDep} --save-dev --registry http://registry.npm.taobao.org`, {cwd: targetPath}));

    } catch (err) {
        throw new Error(err);
    }
}


module.exports = {
    install
};
