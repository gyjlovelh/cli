
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

function install() {
    try {
        let application = fs.readFileSync(path.join(__dirname, '../../config/application.json'), 'utf8').toString();
        application = JSON.parse(application);
        console.log(JSON.stringify(application, null, 4));
        let packageJSON = fs.readFileSync(`${application.runtimePath}/waf-${application.selectedSub}/framework/package.json`, 'utf8').toString();
        packageJSON = JSON.parse(packageJSON);
        let wafPackages = Object.keys(packageJSON.dependencies).filter(key => key.includes('@waf')).join(' ');
        console.log(wafPackages);
        execSync(`npm install ${wafPackages} --registry http://0.0.0.0:4873`, {cwd: `${application.runtimePath}/waf-${application.selectedSub}/framework`});
        // execSync('npm config set registry http://registry.npm.taobao.org');
        execSync('npm install --registry https://registry.npm.taobao.org', {cwd: `${application.runtimePath}/waf-${application.selectedSub}/framework`});
    } catch (err) {
        throw new Error(err);
    }
}


module.exports = {
    install
};
