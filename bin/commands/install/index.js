
const fs = require('fs');
const path = require('path');
const {exec, execSync} = require('child_process');

function install() {
    try {
        let application = fs.readFileSync(path.join(__dirname, '../../config/application.json'), 'utf8').toString();
        application = JSON.parse(application);
        let cwd = `${application.runtimePath}/waf-${application.selectedSub}/framework`;
        console.log(JSON.stringify(application, null, 4));
        let packageJSON = fs.readFileSync(`${cwd}/package.json`, 'utf8').toString();
        packageJSON = JSON.parse(packageJSON);
        let wafPackages = Object.keys(packageJSON.dependencies).filter(key => key.includes('@waf')).join(' ');
        let selfPackages = Object.keys(packageJSON.dependencies)
            .filter(key => !key.includes('@waf'))
            .map(key => `${key}@${packageJSON.dependencies[key]}`).join(' ');

        let devDependencies = Object.keys(packageJSON.devDependencies)
            .map(key => `${key}@${packageJSON.devDependencies[key]}`).join(' ');

        console.log(selfPackages);

        exec(`npm install ${wafPackages} --save --registry http://0.0.0.0:4873`, {cwd}, (err, std) => console.log(std));
        exec(`npm install ${selfPackages} --save --registry http://registry.npm.taobao.org`, {cwd}, (err, std) => console.log(std));
        exec(`npm install ${devDependencies} --save-dev --registry http://registry.npm.taobao.org`, {cwd}, (err, std) => console.log(std));
        // execSync('npm config set registry http://registry.npm.taobao.org');
        // execSync('npm install --registry https://registry.npm.taobao.org', {cwd: `${application.runtimePath}/waf-${application.selectedSub}/framework`});
    } catch (err) {
        throw new Error(err);
    }
}


module.exports = {
    install
};
