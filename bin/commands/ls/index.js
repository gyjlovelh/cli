/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-27 21:54:41
 * @LastEditTime: 2019-03-02 15:22:01
 */
const fss = require('fs-extra');
const inquirer = require('inquirer');
const log = require('../../util/logger');
const appConfig = require('../../util/app-config');
const identifier = '[应用] ';

function ls() {
    const subNames = appConfig.subs.map(item => item.name);
    if (!appConfig.selectedSub) {
        appConfig.selectedSub = appConfig.subs[0];
    }

    inquirer.prompt([{
        type: 'list',
        message: '选择子应用',
        name: 'subName',
        default: appConfig.selectedSub,
        choices: subNames
    }]).then(({subName}) => {
        appConfig.selectedSub = subName;

        const targetPath = `${appConfig.runtimePath}/${appConfig.selectedSub}/framework`;
        fss.ensureDirSync(targetPath)
        
        let pkg = fss.readJSONSync(`${targetPath}/package.json`);
       
        // if (!pkg.dependencies.hasOwnProperty(`@bss-modules/${appConfig.selectedSub}`)) {
        //     pkg.dependencies[`@bss-modules/${appConfig.selectedSub}`] = '~1.0.0';
        // }
    
        
        fss.outputJSONSync(`${targetPath}/package.json`, pkg, {spaces: 4});
        log.info(identifier, '切换应用' + appConfig.selectedSub);
    });
}

module.exports = {
    ls
};
