const appConf = require('./app-config');
const fss = require('fs-extra');

let handler = {

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
        const {bss} = appConf.getApplicationConfig();
        return this.getSubConf(bss.selectedSub);
    },

    /**
     * 获取app的配置
     */
    getAppConf() {
        return appConf.getApplicationConfig().bss;
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
