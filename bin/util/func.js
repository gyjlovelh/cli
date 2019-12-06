const appConf = require('./app-config');
const fss = require('fs-extra');

let handler = {

    /**
     * 获取平台依赖
     */
    getPlatformDependencies() {
        return [
            "@orchid_component/grid",
            "@orchid_component/form",
            "@orchid_component/async-container",
            "@orchid_component/echarts",
            "@orchid_component/icon",
            "@orchid_component/layout",
            "@orchid_component/tree-selector",
            "@orchid_service/auth",
            "@orchid_service/context",
            "@orchid_service/date",
            "@orchid_service/event",
            "@orchid_service/http",
            "@orchid_service/router",
            "@orchid_service/storage",
            "@orchid_service/tpi",
            "@orchid_service/utils",
            "@orchid_resource/themes",
        ];
    },

    /**
     * 获取指定子应用配置信息
     * @param {string} name
     */
    getSubConf(name) {
        const {apps} = appConf.getApplicationConfig();
        if (!apps.has(name)) {
            throw new Error(`子应用: ${name} 未配置在application.json文件中`);
        }
        return apps.get(name);
    },

    /**
     * 获取当前子应用信息
     */
    getCurSubConf() {
        const {orchid} = appConf.getApplicationConfig();
        return this.getSubConf(orchid.selectedSub);
    },

    /**
     * 获取app的配置
     */
    getAppConf() {
        return appConf.getApplicationConfig().orchid;
    },

    /**
     * 获取子应用所有依赖于平台的包
     */
    getSubDeps(name) {
        const sc = this.getSubConf(name);
        const commonDeps = fss.readJSONSync(`${sc.moduleDir}/package.json`).dependencies;
        return [
            sc.modulePkg,
            sc.sharedPkg,
            sc.resourcePkg,
            ...Object.keys(commonDeps)
        ];
    },

    /**
     * 获取common工程所有模块信息
     */
    getCommonDeps() {
        return [];
    },

};

module.exports = handler;
