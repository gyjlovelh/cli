/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-27 21:54:41
 * @LastEditTime: 2019-02-27 22:45:13
 */
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

function ls() {
    let application = fs.readFileSync(path.join(__dirname, '../../config/application.json'), 'utf8');
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
        fs.writeFileSync(path.join(__dirname, '../../config/application.json'), JSON.stringify(application, null, 4), {flag: 'w'});
    });
}

module.exports = {
    ls
};
