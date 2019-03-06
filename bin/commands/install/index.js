"use strict";

const fss = require('fs-extra');
const path = require('path');
const func = require('../../util/func');
const cp = require('child_process');

const log = require('../../util/logger');

const identifier = '[install] ';

function install() {
    try {
        let appInfo = func.getAppConf();
        let sc = func.getCurSubConf();
        let pkg = fss.readJSONSync(`${sc.runtimeDir}/package.json`);

        // 修正rxjs版本
        pkg.dependencies.rxjs = '6.0.0';

        let bssPkgs = Object.keys(pkg.dependencies)
            .filter(key => key.includes(`@${sc.production}`))
            .map(key => `${key}@latest`).join(' ');

        let selfDep = Object.keys(pkg.dependencies)
            .filter(key => !key.includes(`@${sc.production}`))
            .map(key => `${key}@${pkg.dependencies[key]}`).join(' ');

        let devDep = Object.keys(pkg.devDependencies)
            .map(key => `${key}@${pkg.devDependencies[key]}`).join(' ');

        // 指定node-sass的下载源
        log.info(identifier, cp.execSync(`npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass`));

        // 安装BSS平台依赖
        log.info(identifier, cp.execSync(`npm install ${bssPkgs} --save --registry ${appInfo.privateRegistry}`, {cwd: sc.runtimeDir}));

        log.info(identifier, cp.execSync(`npm install ${selfDep} --save --registry ${appInfo.registry}`, {cwd: sc.runtimeDir}));

        log.info(identifier, cp.execSync(`npm install ${devDep} --save-dev --registry ${appInfo.registry}`, {cwd: sc.runtimeDir}));

    } catch (err) {
        throw new Error(err);
    }
}


module.exports = {
    install
};
