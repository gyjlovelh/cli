const appConfig = require('../../util/app-config');
const fss = require('fs-extra');
const cp = require('child_process');
const log = require('../../util/logger');

const identifier = '[publish] ';

let handler = {

    publish: function() {
        try {
            cp.execSync('npm config set scope=bss_modules');
            cp.execSync('npm config set registry http://0.0.0.0:4873/');

            _publish('shared');
            _publish('module');
            _publish('resource');

            cp.execSync('npm config set registry https://registry.npm.taobao.org/');
        } catch (err) {
            throw new Error(err);
        }

        /**
         * 发布@bss_module/frameName模块
         */
        function _publish(name) {
            let targetPath = `${appConfig.sourceCodePath}/${appConfig.selectedSub}/${name}`;
            if (name === 'resource') {
                targetPath += '/scss';
            }
            // 查询要发布包的版本
            if (name === 'module') {
                name = 'modules';
            }
            let version;
            let pkg = fss.readJSONSync(`${targetPath}/package.json`);
            try {
                version = cp.execSync(`npm view @bss_${name}/${appConfig.selectedSub} version`).toString();
                pkg.version = version;
                fss.outputJSONSync(`${targetPath}/package.json`, pkg, {spaces: 4});
                cp.execSync('npm version patch', {cwd: targetPath});
            } catch (err) {
                log.warn(identifier, `首次发布@bss_${name}/${appConfig.selectedSub}`);
            }
            const std = cp.execSync('npm publish', {cwd: targetPath});
            log.info(identifier, std);
        }
    }

};

module.exports = handler;
