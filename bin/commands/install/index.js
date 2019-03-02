
const fs = require('fs');
const path = require('path');
const {exec, execSync} = require('child_process');

let applicationJsonPath = path.join(__dirname, '../../../config/application.json');

function install() {
    try {
        let application = fs.readFileSync(applicationJsonPath, 'utf8').toString();
        application = JSON.parse(application);
        let cwd = `${application.runtimePath}/waf-${application.selectedSub}/framework`;
        let packageJSON = fs.readFileSync(`${cwd}/package.json`, 'utf8').toString();
        packageJSON = JSON.parse(packageJSON);
        // 补丁：解决 rxjs^6.4.0 转为 ^6.0.0
        packageJSON.dependencies.rxjs = '^6.0.0';

        let wafPackages = Object.keys(packageJSON.dependencies).filter(key => key.includes('@waf')).join(' ');
        let selfPackages = Object.keys(packageJSON.dependencies)
            .filter(key => !key.includes('@waf'))
            .map(key => `${key}@${packageJSON.dependencies[key]}`).join(' ');

        let devDependencies = Object.keys(packageJSON.devDependencies)
            .map(key => `${key}@${packageJSON.devDependencies[key]}`).join(' ');

        console.log(selfPackages);
        // 指定node-sass的下载源
        let process_ns = exec('npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass', {cwd}, (err, stdout) => {
            if (err) {
                console.log(err);
            }
            console.log(stdout);
            process_ns.kill();
        });

        let process_waf = exec(`npm install ${wafPackages} --save --registry http://0.0.0.0:4873`, {cwd}, (err, stdout) => {
            if (err) {
                console.log(err);
            }
            console.log(stdout);
            process_waf.kill();
        });

        let process_all = exec(`npm install ${selfPackages} --save --registry http://registry.npm.taobao.org`, {cwd}, (err, stdout) => {
            if (err) {
                console.log(err);
            }
            console.log(stdout);
            process_all.kill();
        });

        let proccess_dev = exec(`npm install ${devDependencies} --save-dev --registry http://registry.npm.taobao.org`, {cwd}, (err, stdout) => {
            if (err) {
                console.log(err);
            }
            console.log(stdout);
            proccess_dev.kill();
        });
        // execSync('npm config set registry http://registry.npm.taobao.org');
        // execSync('npm install --registry https://registry.npm.taobao.org', {cwd: `${application.runtimePath}/waf-${application.selectedSub}/framework`});
    } catch (err) {
        throw new Error(err);
    }
}


module.exports = {
    install
};
