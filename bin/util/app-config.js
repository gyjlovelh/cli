'use strict';

const fss = require('fs-extra');
const path = require('path');
const log = require('./logger');
const fnUtil = require('../util/file-name.util');

let hendler = {

    /** bss配置 */
    bss: {},

    /** app配置表 */
    apps: new Map(),

    /**
     * 获取应用信息
     */
    getApplicationConfig: function() {
        if (Object.keys(this.bss).length === 0) {
            log.info('[app] ', '读取application.json文件.');
            let appJson = fss.readJSONSync(path.join(__dirname, '../../config/application.json'));

            this.initAppConf(appJson);

            this.initCommonConfig(appJson);

            this.initSubsConfig(appJson);
        }
        return {bss: this.bss, apps: this.apps};
    },

    /**
     * 获取应用配置信息
     *
     * @param {object} params
     */
    initApplicationConfig: function(params) {
        const appJson = fss.readJSONSync(params.sourceCodePath + '/application.json');
        appJson.sourceCodePath = params.sourceCodePath;
        appJson.subs = appJson.subs.map(sub => {
            // json中统一小横线
            sub.name = fnUtil.camelToLetter( fnUtil.anyToCamel(sub.name) );
            sub.version || (sub.version = '1.0.0');
            sub.modules = (sub.modules || []).map(mod => {
                mod.name = fnUtil.camelToLetter( fnUtil.anyToCamel(mod.name) );
                return mod;
            });
            return sub;
        });

        appJson.selectedSub = appJson.subs[0].name;

        fss.outputJsonSync(path.join(__dirname, '../../config/application.json'), appJson, {spaces: 4});

    },

    initAppConf: function(appJson) {
        // 设置私服
        this.bss = {
            name: appJson.name,
            production: appJson.production,
            version: appJson.version,
            selectedSub: appJson.selectedSub,
            subs: appJson.subs,
            codeRootDir: appJson.sourceCodePath,
            runtimeRootDir: appJson.runtimePath,
            distRootDir: appJson.distPath,

            // privateRegistry: 'http://0.0.0.0:4873',
            // registry: 'http://registry.npm.taobao.org',
        };
    },

    initCommonConfig: function(appJson) {
        let root = `${appJson.sourceCodePath}/common`;
        let common = {
            name: 'common',

            // 发布包配置
            componentPkgPrefix: `@${appJson.production}_common_component`,
            modulePkgPrefix: `@${appJson.production}_common_module`,
            servicePkgPrefix: `@${appJson.production}_common_service`,
            resourcePkgPrefix: `@${appJson.production}_common_resource`,

            // 本地库
            codeRootDir: root,
            moduleDir: `${root}/module`,
            componentDir: `${root}/component`,
            serviceDir: `${root}/service`,
            resourceDir: `${root}/resource`
        };
        this.apps.set('common', common);
    },

    initSubsConfig: function(appJson) {

        appJson.subs.forEach(sub => {
            this.apps.set(sub.name, getSubConf(sub));
        });

        function getSubConf(sub) {
            return {
                name: sub.name,
                camelName: fnUtil.anyToCamel(sub.name),
                filePrefix: sub.name,
                production: appJson.production,
                version: sub.version,
                rulesDirectory: `${appJson.runtimePath}/${sub.name}/framework/node_modules/codelyzer`,
                baseUrl: `${appJson.runtimePath}/${sub.name}/framework/node_modules`,

                // 骨架模板文件配置
                moduleSkeleton: path.join(__dirname, '../skeleton/skeleton_module'),
                sharedSkeleton: path.join(__dirname, '../skeleton/skeleton_shared'),
                resourceSkeleton: path.join(__dirname, '../skeleton/skeleton_resource'),

                // 发布配置
                modulePkg: `@${appJson.production}_module/${sub.name}`,
                sharedPkg: `@${appJson.production}_shared/${sub.name}`,
                resourcePkg: `@${appJson.production}_resource/${sub.name}`,

                // 本地库配置
                codeRootDir: `${appJson.sourceCodePath}/${sub.name}`,
                moduleDir: `${appJson.sourceCodePath}/${sub.name}/module`,
                sharedDir: `${appJson.sourceCodePath}/${sub.name}/shared`,
                resourceDir: `${appJson.sourceCodePath}/${sub.name}/resource`,

                // 运行环境配置
                runtimeRootDir: `${appJson.runtimePath}/${sub.name}`,
                runtimeDir: `${appJson.runtimePath}/${sub.name}/framework`,

                // 模板位置
                runtimeAppSkeleton: path.join(__dirname, '../skeleton/runtime_app'),
                runtimeTsconfigSkeleton: path.join(__dirname, '../skeleton/runtime_tsconfig'),
                runtimeIndexSkeleton: path.join(__dirname, '../skeleton/runtime_index'),
                runtimeStyleSkeleton: path.join(__dirname, '../skeleton/runtime_styles'),
                // 归档配置
                distDir: `${appJson.distPath}/${sub.name}`
            };
        }
    }

};

module.exports = hendler;
