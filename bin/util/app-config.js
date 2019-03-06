const fss = require('fs-extra');
const path = require('path');
const fnUtil = require('../util/file-name.util');

let hendler = {

    /** bss配置 */
    bss: {},

    /** app配置表 */
    apps: new Map(),

    /**
     *
     *
     * @param {object} params
     */
    getApplicationConfig: function() {
        return fss.readJSONSync(path.join(__dirname, '../../config/application.json'));
    },

    getAppConf() {
        return this.bss;
    },

    get subs() {
        return this.bss.subs;
    },

    set selectedSub(subName) {
        let config = this.getApplicationConfig();
        config.selectedSub = subName;
        this.bss.selectedSub = subName;
        fss.outputJSONSync(path.join(__dirname, '../../config/application.json'), config, {spaces: 4});
    },

    get selectedSub() {
        return this.bss.selectedSub;
    },

    /**
     * @deprecated
     */
    get sourceCodePath() {
        return fss.readJSONSync(path.join(__dirname, '../../config/application.json')).sourceCodePath;
    },

    /**
     * @deprecated
     */
    get runtimePath() {
        return fss.readJSONSync(path.join(__dirname, '../../config/application.json')).runtimePath;
    },

    get curSubConf() {
        return this.apps.get(this.selectedSub());
    },

    getSubConf(name) {
        return this.apps.get(name);
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
            // 配置子应用信息
            hendler.apps.set(sub.name, getSubConfig(sub));
            return sub;
        });
        // common工程配置
        this.apps.set('common', getCommonConfig());
        // 初始化工程信息
        this.bss = initAppConf();
        this.bss.subs = appJson.subs;
        // 初始化选中为第一个子应用
        this.bss.selectedSub = appJson.selectedSub = appJson.subs && appJson.subs[0].name;
        fss.outputJsonSync(path.join(__dirname, '../../config/application.json'), appJson, {spaces: 4});

        function initAppConf() {
            // 设置私服
            return {
                name: appJson.name,
                production: appJson.production,
                version: appJson.version,

                codeRootDir: appJson.sourceCodePath,
                runtimeRootDir: appJson.runtimePath,
                distRootDir: appJson.distPath,

                privteRegistry: 'http://0.0.0.0:4873',
                registry: 'http://registry.npm.taobao.org',
            };
        }

        function getSubConfig(sub) {

            return {
                name: sub.name,
                camelName: fnUtil.anyToCamel(sub.name),
                production: appJson.production,
                version: sub.version,

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
                runtimeAppSkeleton: path.join(__dirname, '../skeleton/runtime_app'),
                runtimeTsconfigSkeleton: path.join(__dirname, '../skeleton/runtime_tsconfig'),
                runtimeIndexSkeleton: path.join(__dirname, '../skeleton/runtime_index'),
                runtimeStyleSkeleton: path.join(__dirname, '../skeleton/runtime_style'),
                // 归档配置
                distDir: `${appJson.distPath}/${sub.name}`

                // defaultTheme


            };
        }

        function getCommonConfig() {
            let root = `${appJson.sourceCodePath}/common`;
            return {
                name: 'common',

                // 发布包配置
                componentPkgPrefix: `@${appJson.name}_common_component`,
                modulePkgPrefix: `@${appJson.name}_common_module`,
                servicePkgPrefix: `@${appJson.name}_common_service`,
                resourcePkgPrefix: `@${appJson.name}_common_resource`,

                // 本地库
                codeRootDir: root,
                moduleDir: `${root}/module`,
                componentDir: `${root}/component`,
                serviceDir: `${root}/service`,
                resourceDir: `${root}/resource`
            };
        }
    }

};



module.exports = hendler;
