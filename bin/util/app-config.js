const fss = require('fs-extra');
const path = require('path');
const fnUtil = require('../util/file-name.util');

let hendler = {

    /**
     *
     *
     * @param {object} params
     */
    getApplicationConfig: function() {
        return fss.readJSONSync(path.join(__dirname, '../../config/application.json'));
    },

    get subs() {
        return fss.readJSONSync(path.join(__dirname, '../../config/application.json')).subs;
    },

    set selectedSub(subName) {
        let config = this.getApplicationConfig();
        config.selectedSub = subName;
        fss.outputJSONSync(path.join(__dirname, '../../config/application.json'), config, {spaces: 4});
    },

    get selectedSub() {
        return fss.readJSONSync(path.join(__dirname, '../../config/application.json')).selectedSub;
    },

    get sourceCodePath() {
        return fss.readJSONSync(path.join(__dirname, '../../config/application.json')).sourceCodePath;
    },

    get runtimePath() {
        return fss.readJSONSync(path.join(__dirname, '../../config/application.json')).runtimePath;
    },

    get curAppConf() {
        
    },

    /**
     * 获取应用配置信息
     *
     * @param {object} params
     */
    initApplicationConfig: function(params) {
        const appJson = fss.readJSONSync(params.sourceCodePath + '/application.json');
        appJson.sourceCodePath = params.sourceCodePath;
        appJson.subs.map(sub => {
            // json中统一小横线
            sub.name = fnUtil.camelToLetter( fnUtil.anyToCamel(sub.name) );
            sub.modules = (sub.modules || []).map(mod => {
                mod.name = fnUtil.camelToLetter( fnUtil.anyToCamel(mod.name) );
                return mod;
            });
            return sub;
        });
        // 初始化选中为第一个子应用
        appJson.selectedSub = appJson.subs && appJson.subs[0].name;
        fss.outputJsonSync(path.join(__dirname, '../../config/application.json'), appJson, {spaces: 4});
    }

};



module.exports = hendler;
