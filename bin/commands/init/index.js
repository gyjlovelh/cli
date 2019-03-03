/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-26 17:37:34
 * @LastEditTime: 2019-03-03 11:36:57
 */
const inquirer = require('inquirer');
const fss = require('fs-extra');
const os = require('os');
const log = require('../../util/logger');
const appConfig = require('../../util/app-config');
const art = require('art-template');
const path = require('path');
const fnUtil = require('../../util/file-name.util');

const identifier = '[初始化] ';

let handler = {
    init: function () {
        try {
            let steps = [{
                type: 'input',
                message: '请输入产品工作空间路径',
                name: 'sourceCodePath',
                default: '/Users/guanyj/workspace/hibiscus'
            }
        ];
            inquirer.prompt(steps).then(handleInit);
        } catch (err) {
            throw new Error(err);
        }

        /**
         * 初始化
         * 
         * @param {object} inputs 
         */
        function handleInit(inputs) {
            if (!inputs.sourceCodePath) {
                throw new Error(identifier + '请输入正确的工作目录');
            }

            if (os.type() === 'Windows_NT') {
                throw new Error(identifier + '目前不支持windows操作系统');
            }

            if (!fss.existsSync(inputs.sourceCodePath + '/application.json')) {
                throw new Error(identifier + '工作目录下缺少application.json文件');
            }
            
            // 1.生成工作目录配置文件
            appConfig.initApplicationConfig(inputs);
            log.info(identifier, '同步application.json');

            // 2.记录应用骨架应用
            
            // console.log(art);
            // 3.生成子应用工程
            appConfig.subs.forEach(sub => {
                let templateDir = path.join(__dirname, '../../skeleton/framework');
                let module = {
                    name: sub.name,
                    filePrefix:  sub.name,
                    camelName: fnUtil.anyToCamel(sub.name),
                    pkg: '@bss_modules',
                    version: '1.0.0',
                    rulesDirectory: `${appConfig.runtimePath}/${sub.name}/framework/node_modules/codelyzer`,
                    baseUrl: `${appConfig.runtimePath}/${sub.name}/framework/node_modules`
                };
                resolveFramework(templateDir, appConfig.getApplicationConfig().sourceCodePath + '/' + module.name, module);
            });

            // 4.发布选中子应用工程
            
        }

        /**
         * 遍历模板目录生成模板文件
         * 
         * @param {string} dir 
         * @param {object} module 
         */
        function resolveFramework(dir, targetDir, module) {
            // 模板目录下所有文件
            const files = fss.readdirSync(dir);
            files.forEach(filename => {
                // 模板文件路径
                let fileRealPath = path.join(dir, filename);
                const stat = fss.statSync(fileRealPath);
                if (stat.isFile()) {
                    const template = art.render(fss.readFileSync(fileRealPath).toString(), {module});
                    // 目标文件名
                    let targetName = filename.replace(/frame/g, module.name).replace(/\.art$/g, '');
                    // 目标文件地址
                    let targetPath = `${targetDir}/${targetName}`;
                    if (!fss.existsSync(targetPath)) {
                        fss.outputFileSync(targetPath, template);
                        log.info(identifier, '创建文件' + targetPath);
                    }
                } else {
                    fss.ensureDirSync(targetDir);
                    resolveFramework(fileRealPath, `${targetDir}/${filename}`, module);
                }
            });
        }
    }
};

module.exports = handler;
