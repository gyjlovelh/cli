
const fss = require('fs-extra');
const path = require('path');

const log = require('../../util/logger');
const appConfig = require('../../util/app-config');

const identifier = '[update] ';

let handler = {

    update: function(params) {
        
        // 将sourceCode中的新增代码，copy到runtime的node_modules/@bss_modules/frameworkName目录中

        // 1.遍历sourceCode文件夹
        let selectedSub = appConfig.selectedSub;

        resolveSourceCode(`${appConfig.sourceCodePath}/${selectedSub}`,
             `${appConfig.runtimePath}/${selectedSub}/framework/node_modules/@bss_modules/${selectedSub}`);

        /**
         * 
         * @param {*} dir 
         * @param {*} targetDir 
         */
        function resolveSourceCode(dir, targetDir, ) {
            const files = fss.readdirSync(dir);

            files.forEach(filename => {
                // 模板文件路径
                let fileRealPath = path.join(dir, filename);
                const stat = fss.statSync(fileRealPath);
                if (stat.isFile()) {
                    // 拷贝文件
                    fss.copyFileSync(fileRealPath, `${targetDir}/${filename}`);
                    log.info(identifier, `copy ${fileRealPath} -> ${targetDir}/${filename}`);
                } else {
                    fss.ensureDirSync(targetDir);
                    resolveSourceCode(fileRealPath, `${targetDir}/${filename}`);
                }
            });
        }
    }
}

module.exports = handler;
