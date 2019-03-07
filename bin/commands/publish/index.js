'use strict';

const fss = require('fs-extra');
const func = require('../../util/func');
const cp = require('child_process');
const log = require('../../util/logger');

const identifier = '[publish] ';

let handler = {

    publish: function() {
        let sc = func.getCurSubConf();
        let appInfo = func.getAppConf();
        try {
            cp.execSync(`npm config set scope=${appInfo.production}`);
            // cp.execSync(`npm config set registry=${appInfo.privateRegistry}`);

            /** 1.发布子应用模块 */
            publishSubModule();

            /** 2.发布子应用共享模块 */
            publishSubShared();

            /** 3.发布子应用资源模块 */
            publishSubResource();

            // cp.execSync(`npm config set registry=${appInfo.registry}`);
        } catch (err) {
            throw new Error(err);
        }

        function publishSubModule() {
            let pkg = fss.readJSONSync(`${sc.moduleDir}/package.json`);
            let version;
            try {
                version = cp.execSync(`npm view ${sc.modulePkg} version`);
                version = version.toString();
                pkg.version = version;
                fss.outputJSONSync(`${sc.moduleDir}/package.json`, pkg, {spaces: 4});
                cp.execSync('npm version patch', {cwd: sc.moduleDir});
            } catch (err) {
                log.warn(identifier, `首次发布 ${sc.modulePkg}`);
            }
            const std = cp.execSync('npm publish', {cwd: sc.moduleDir});
            log.info(identifier, std);
        }

        function publishSubShared() {
            let pkg = fss.readJSONSync(`${sc.sharedDir}/package.json`);
            let version;
            try {
                version = cp.execSync(`npm view ${sc.sharedPkg} version`).toString();
                pkg.version = version;
                fss.outputJSONSync(`${sc.sharedDir}/package.json`, pkg, {spaces: 4});
                cp.execSync('npm version patch', {cwd: sc.sharedDir});
            } catch (err) {
                log.warn(identifier, `首次发布 ${sc.sharedPkg}`);
            }
            const std = cp.execSync('npm publish', {cwd: sc.sharedDir});
            log.info(identifier, std);
        }

        function publishSubResource() {
            let pkg = fss.readJSONSync(`${sc.resourceDir}/scss/package.json`);
            let ctx = `${sc.resourceDir}/scss`;
            let version;
            try {
                version = cp.execSync(`npm view ${sc.resourcePkg} version`).toString();
                pkg.version = version;
                fss.outputJSONSync(`${ctx}/package.json`, pkg, {spaces: 4});
                cp.execSync('npm version patch', {cwd: ctx});
            } catch (err) {
                log.warn(identifier, `首次发布 ${sc.resourcePkg}`);
            }
            const std = cp.execSync('npm publish', {cwd: ctx});
            log.info(identifier, std);
        }

    }

};

module.exports = handler;
