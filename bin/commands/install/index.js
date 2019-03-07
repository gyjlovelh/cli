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
        fss.outputJSONSync(`${sc.runtimeDir}/package.json`, pkg, {spaces: 4});
        // 指定node-sass的下载源
        // log.info(identifier, cp.execSync(`npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass`));
        log.info(identifier, cp.execSync(`npm install`, {cwd: `${sc.runtimeDir}`}));

    } catch (err) {
        throw new Error(err);
    }
}


module.exports = {
    install
};
