'use strict';
const fss = require('fs-extra');
const path = require('path');
const art = require('art-template');
const log = require('../util/logger');

const identifier = '[render] ';

let handler = {
    /**
     * 遍历模板目录生成模板文件
     *
     * @param {string} dir 模板路径
     * @param {string} dest 目标路径
     * @param {object} module 模板参数
     * @param {object} options 配置
     */
    resolveFramework: function(dir, dest, module, options) {
        options = options || {};
        // 模板目录下所有文件
        const files = fss.readdirSync(dir);
        files.forEach(filename => {
            // 模板文件路径
            let fileRealPath = path.join(dir, filename);
            const stat = fss.statSync(fileRealPath);
            if (stat.isFile()) {
                const template = art.render(fss.readFileSync(fileRealPath).toString(), {
                    module
                });
                // 目标文件名
                let targetName = filename.replace(/frame/g, module.name).replace(/\.art$/g, '');
                // 目标文件地址
                let targetPath = `${dest}/${targetName}`;
                if (!fss.existsSync(targetPath) || options.overwrite) {
                    fss.outputFileSync(targetPath, template);
                    let str = options.overwrite ? '覆盖文件' : '创建文件';
                    log.info(identifier, str + targetPath);
                }
            } else {
                fss.ensureDirSync(dest);
                this.resolveFramework(fileRealPath, `${dest}/${filename}`, module);
            }
        });
    }
};

module.exports = handler;
