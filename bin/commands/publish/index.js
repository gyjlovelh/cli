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
            // publishSubModule();
            publishSubModuleWithSameVersion();

            /** 2.发布子应用共享模块 */
            // publishSubShared();
            publishSubSharedWithSameVersion();

            /** 3.发布子应用资源模块 */
            // publishSubResource();
            publishSubResourceWidthSameVersion();

            // cp.execSync(`npm config set registry=${appInfo.registry}`);
        } catch (err) {
            log.error(identifier, err);
        }

        /**
         * 为避免版本频繁发生变动会产生的很多问题。
         * 现在统一使用固定版本v1.0.0
         * @deprecated use `publishSubModuleWithSameVersion` instead
         */
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

        /**
         * 发布业务模块
         */
        function publishSubModuleWithSameVersion() {
            try {
                cp.execSync(`npm view ${sc.modulePkg} version`);
                cp.execSync(`npm unpublish ${sc.modulePkg} --force`);
                log.warn(identifier, `撤销${sc.modulePkg}`);
            } catch (err) {
                log.warn(identifier, `首次发布 ${sc.modulePkg}`);
            }
            const std = cp.execSync('npm publish', {cwd: sc.moduleDir});
            log.info(identifier, std);
        }

        /**
         * @deprecated
         */
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

        /**
         * 发布业务共享模块
         */
        function publishSubSharedWithSameVersion() {
            try {
                cp.execSync(`npm view ${sc.sharedPkg} version`).toString();
                cp.execSync(`npm unpublish ${sc.sharedPkg} --force`);
                log.warn(identifier, `撤销${sc.sharedPkg}`);
            } catch (err) {
                log.warn(identifier, `首次发布 ${sc.sharedPkg}`);
            }
            const std = cp.execSync('npm publish', {cwd: sc.sharedDir});
            log.info(identifier, std);
        }

        /**
         * @deprecated
         */
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

        /**
         * 发布业务资源模块
         */
        function publishSubResourceWidthSameVersion() {
            // ctx = `${sc.resourceDir}/scss
            try {
                cp.execSync(`npm view ${sc.resourcePkg} version`).toString();
                cp.execSync(`npm unpublish ${sc.resourcePkg} --force`);
                log.warn(identifier, `撤销${sc.resourcePkg}`);
            } catch (err) {
                log.warn(identifier, `首次发布 ${sc.resourcePkg}`);
            }
            const std = cp.execSync('npm publish', {cwd: `${sc.resourceDir}/scss`});
            log.info(identifier, std);
        }
    }

};

module.exports = handler;
