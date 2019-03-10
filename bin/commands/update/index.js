'use strict';

const fss = require('fs-extra');
const path = require('path');

const log = require('../../util/logger');
const func = require('../../util/func');

const identifier = '[update] ';

let handler = {

    update: function(params) {
        try {
            // 将开发目录中的代码复制到运行中

            let sc = func.getCurSubConf();

            // 1.复制module中代码到 @xxx_module/subName
            resolveSourceCode(`${sc.moduleDir}`, `${sc.runtimeDir}/node_modules/${sc.modulePkg}`);

            // 2.复制shared代码到 @xxx_shared/subName
            resolveSourceCode(sc.sharedDir, `${sc.runtimeDir}/node_modules/${sc.sharedPkg}`);

            // 3.复制resource/scss 到 @xxx_resource/subName
            resolveSourceCode(`${sc.resourceDir}/scss/src`, `${sc.runtimeDir}/node_modules/${sc.resourcePkg}/src`);
        } catch (error) {
            log.error(identifier, error);
        }

        /**
         *
         * @param {*} dir
         * @param {*} dest
         */
        function resolveSourceCode(dir, dest) {
            const files = fss.readdirSync(dir);

            files.forEach(filename => {
                // 模板文件路径
                let fileRealPath = path.join(dir, filename);
                const stat = fss.statSync(fileRealPath);
                if (stat.isFile()) {
                    // 拷贝文件 
                    fss.copyFileSync(fileRealPath, `${dest}/${filename}`);
                    log.info(identifier, `复制文件 ${fileRealPath} => ${dest}/${filename}`);
                } else {
                    fss.ensureDirSync(dest);
                    resolveSourceCode(fileRealPath, `${dest}/${filename}`);
                }
            });
        }
    }
}

module.exports = handler;
