
const func = require('../../util/func');
const log = require('../../util/logger');
const cp = require('child_process');
const fss = require('fs-extra');

const identifer = '[add] ';

let handler = {

    doAdd(pkgs, arg) {
        const curSc = func.getCurSubConf();
        try {
            let curJson;
            if (arg.shared) {
                curJson = fss.readJSONSync(`${curSc.sharedDir}/package.json`);
            } else {
                curJson = fss.readJSONSync(`${curSc.moduleDir}/package.json`);
            }
           
            pkgs.forEach(pkg => {
                if (!/^@[a-z]+_common_module|service|component|resource\/\w+$/g.test(pkg)) {
                    log.error(identifer, `目前阶段不支持不属于common工程的依赖包，${pkg}。`);
                } else {
                    // 下载
                    const version = cp.execSync(`npm view ${pkg} version`);
                    if (arg.shared) {
                        cp.execSync(`npm install ${pkg}@latest`, {cwd: curSc.runtimeDir});
                    } else {
                        cp.execSync(`npm install ${pkg}@latest --save`, {cwd: curSc.runtimeDir});
                    }
                    curJson.dependencies[pkg] = version;
                    log.info(identifer, `成功添加${pkg}@${version}`);
                }
            });
            if (arg.shared) {
                fss.outputJSONSync(`${curSc.sharedDir}/package.json`, curJson, {spaces: 4});
            } else {
                fss.outputJSONSync(`${curSc.moduleDir}/package.json`, curJson, {spaces: 4});
            }
        } catch (err) {
            log.error(identifer, err);
        }
    }
};

module.exports = handler;