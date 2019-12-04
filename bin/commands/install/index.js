"use strict";

const fss = require('fs-extra');
const path = require('path');
const func = require('../../util/func');
const cp = require('child_process');

const log = require('../../util/logger');

const identifier = '[install] ';

function install(pkgs, arg) {
    try {
        let sc = func.getCurSubConf();
        let pkg = fss.readJSONSync(`${sc.runtimeDir}/package.json`);

        // 更新所有bss平台模块
        if (arg.latest) {
            let bssPkgs = func.getSubDeps(sc.name);
            bssPkgs = bssPkgs.join('@latest ');
            log.info(identifier ,cp.execSync(`npm install ${bssPkgs} --save`, {cwd: sc.runtimeDir}));
            return;
        }

        // 更新指定模块
        if (pkgs && pkgs.length > 0) {

            let flag = false, bssPkgs = '';
            for (let i = 0; i < pkgs.length; i++) {
                if (!/^@[a-zA-Z_-]+([\/]{1})[a-zA-Z_-]+$/g.test(pkgs[i].trim())) {
                    log.error(identifier, '输入不合法:' + pkgs[i] + '，参考[ /^@[a-zA-Z_-]+[\/]{1}[a-zA-Z_-]+$/ ]格式；');
                    flag = true;
                }
                bssPkgs += ` ${pkgs[i]}@latest `;
            }
            if (flag) return;
            log.info(identifier, cp.execSync(`npm install ${bssPkgs} --save`, {cwd: sc.runtimeDir}));
            return;
        }

        // 修正rxjs版本
        // pkg.dependencies.rxjs = '6.0.0';
        fss.outputJSONSync(`${sc.runtimeDir}/package.json`, pkg, {spaces: 4});
        // 指定node-sass的下载源
        // log.info(identifier, cp.execSync(`npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass`));
        log.info(identifier, cp.execSync(`npm install`, {cwd: `${sc.runtimeDir}`}));

    } catch (err) {
        log.error(identifier, err);
    }
}


module.exports = {
    install
};
