'use strict';
/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-27 21:54:41
 * @LastEditTime: 2019-03-06 17:13:42
 */
const inquirer = require('inquirer');
const fss = require('fs-extra');
const path = require('path');
const log = require('../../util/logger');
const func = require('../../util/func');
const identifier = '[应用] ';

function ls() {
    let appConf = func.getAppConf();
    const subNames = appConf.subs.map(item => item.name);

    if (!appConf.selectedSub) {
        appConf.selectedSub = appConf.subs[0];
    }

    inquirer.prompt([{
        type: 'list',
        message: '选择子应用',
        name: 'subName',
        default: appConf.selectedSub,
        choices: subNames
    }]).then(({subName}) => {
        appConf.selectedSub = subName;
        let appDir = path.join(__dirname, '../../../config/application.json');
        let appJson = fss.readJsonSync(appDir);
        appJson.selectedSub = subName;
        fss.outputJSONSync(appDir, appJson, {spaces: 4});
        log.info(identifier, '切换应用' + subName);
    });
}

module.exports = {
    ls
};
