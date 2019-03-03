const appConfig = require('../../util/app-config');
const cp = require('child_process');
const log = require('../../util/logger');

const identifier = '[发布]';

let handler = {

    publish: function() {
        try {
            let targetPath = `${appConfig.sourceCodePath}/${appConfig.selectedSub}`;

            cp.execSync('npm config set scope=bss_modules');
            cp.execSync('npm config set registry http://0.0.0.0:4873/');
            cp.execSync('npm version patch', {cwd: targetPath});
            const std = cp.execSync('npm publish', {cwd: targetPath});
            log.info(identifier, std);
            cp.execSync('npm config set registry https://registry.npm.taobao.org/');
        } catch (err) {
            throw new Error(err);
        }
    }

};

module.exports = handler;
