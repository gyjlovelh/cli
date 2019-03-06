const appConf = require('./app-config');

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

    getAppConf() {
        return appConf.getApplicationConfig().bss;
    },

    /**
     * 获取common工程所有模块信息
     */
    getCommonModules() {},


};

module.exports = handler;
