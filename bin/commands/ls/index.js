/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-27 21:54:41
 * @LastEditTime: 2019-03-02 15:22:01
 */
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const {useFramework} = require('../../util/runtime.util');

let applicationJsonPath = path.join(__dirname, '../../../config/application.json');

function ls() {
    let application = fs.readFileSync(applicationJsonPath, 'utf8');
    application = JSON.parse(application);
    const subNames = application.subs.map(item => item.name);
    if (!application.selectedSub) {
        application.selectedSub = subNames[0];
    }

    inquirer.prompt([{
        type: 'list',
        message: '选择子应用',
        name: 'subName',
        default: application.selectedSub,
        choices: subNames
    }]).then(({subName}) => {
        application.selectedSub = subName;
        useFramework(application, application.selectedSub);
        fs.writeFileSync(applicationJsonPath, JSON.stringify(application, null, 4), {flag: 'w'});
    });
}

module.exports = {
    ls
};
