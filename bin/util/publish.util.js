const {execSync} = require('child_process');

/**
 * 发布子应用工程
 * 
 * @param {string} name 
 */
function publishFramework(application, name) {
    let cwd = `${application.sourcePath}/waf-${name}`;
    execSync('npm config set scope=waf');
    execSync('npm config set registry http://0.0.0.0:4873/ ');
    execSync('npm version patch', {cwd: cwd});
    execSync('npm publish', {cwd: cwd});
}

module.exports = {
    publishFramework
};
