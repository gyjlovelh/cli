/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-26 17:37:34
 * @LastEditTime: 2019-03-06 16:00:11
 */
const inquirer = require('inquirer');
const fss = require('fs-extra');
const os = require('os');
const log = require('../../util/logger');
const appConfig = require('../../util/app-config');
const art = require('art-template');
const path = require('path');
const fnUtil = require('../../util/file-name.util');
const cp = require('child_process');

const identifier = '[初始化] ';

let handler = {
    init: function () {
        try {
            let defaultSourceCodePath = '';
            log.info(identifier, '当前操作为' + os.type());
            if (os.type() === 'Windows_NT') {
                // windows
                defaultSourceCodePath = 'd:/workspace/sourceCode';
            } else {
                // MacOs
                defaultSourceCodePath = '/Users/guanyj/workspace/sourceCode';
            }
            let steps = [{
                type: 'input',
                message: '请输入产品工作空间路径',
                name: 'sourceCodePath',
                default: defaultSourceCodePath
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

            if (!fss.existsSync(inputs.sourceCodePath + '/application.json')) {
                throw new Error(identifier + '工作目录下缺少application.json文件');
            }

            // 1.生成工作目录配置文件
            appConfig.initApplicationConfig(inputs);
            log.info(identifier, '同步application.json');

            // 2.生成common工程
            let commonConf = appConfig.getSubConf('common');
            fss.ensureDirSync(commonConf.moduleDir);
            fss.ensureDirSync(commonConf.componentDir);
            fss.ensureDirSync(commonConf.serviceDir);
            fss.ensureDirSync(commonConf.resourceDir);

            // 3.生成子应用工程
            appConfig.subs.forEach(sub => {
                let sc = appConfig.getSubConf(sub.name);
                // 模板配置信息
                let module = {
                    name: sub.name,
                    filePrefix:  sub.name,
                    camelName: fnUtil.anyToCamel(sub.name),
                    pkg: sc.modulePkg,
                    sharedPkg: sc.sharedPkg,
                    resourcePkg: sc.resourcePkg,
                    version: '1.0.0',
                    rulesDirectory: `${sc.runtimeDir}/node_modules/codelyzer`,
                    baseUrl: `${sc.runtimeDir}/node_modules`
                };

                // 3.1 生成子应用module工程
                resolveFramework(sc.moduleSkeleton, sc.moduleDir, module);

                // 3.1 生成子应用shared工程
                resolveFramework(sc.sharedSkeleton, sc.sharedDir, module);

                // 3.1 生成子应用resource工程
                resolveFramework(sc.resourceSkeleton, sc.resourceDir, module);

            });

            // 4.生成运行环境骨架
            appConfig.subs.forEach(sub => {
                let sc = appConfig.getSubConf(sub.name);
                fss.ensureDirSync(sc.runtimeDir);

                // 首次创建运行环境骨架
                if (!fss.existsSync(`${sc.runtimeDir}/package.json`)) {
                    log.info(identifier, cp.execSync(`ng new framework --skip-install --style=scss --skip-tests --prefix ${sc.production}`, {cwd: sc.runtimeRootDir}));
                }

                //
                const pkg = fss.readJSONSync(`${sc.runtimeDir}/package.json`);
                // 写入公共依赖
                 // todo
                // pkg.dependencies[`@bss_common_components/xxx`] = `~1.0.0`;
                // pkg.dependencies[`@bss_common_modules/xxx`] = `~1.0.0`;
                // pkg.dependencies[`@bss_common_services/xxx`] = `~1.0.0`;
                // pkg.dependencies[`@bss_common_resource/xxx`] = `~1.0.0`;

                // 写入子应用模块
                pkg.dependencies[sc.modulePkg] = '~1.0.0';
                pkg.dependencies[sc.sharedPkg] = '~1.0.0';
                pkg.dependencies[sc.resourcePkg] = '~1.0.0';

                // 修正 rxjs@6.4.0 无法正常启动BUG
                pkg.dependencies.rxjs = `^6.0.0`;

                fss.outputJSONSync(`${sc.runtimeDir}/package.json`, pkg, {spaces: 4});
                log.info(identifier, '[修改文件] ' + `${sc.runtimeDir}/package.json`);

                // 3.渲染 /src/app 模板文件
                let appModule = {
                    name: sub.name,
                    filePrefix:  sub.name,
                    camelName: fnUtil.anyToCamel(sub.name),
                };

                resolveFramework(
                    sc.runtimeAppSkeleton,
                    `${sc.runtimeDir}/src/app`,
                    appModule,
                    {overwrite: true}
                );

                // 4.覆盖tsconfig.json
                let includeModule = [
                    sc.modulePkg,
                    sc.sharedPkg,
                    sc.resourcePkg,
                ];
                resolveFramework(
                    sc.runtimeTsconfigSkeleton,
                    sc.runtimeDir,
                    {include: includeModule},
                    {overwrite: true}
                );

                // 5.覆盖index.html
                resolveFramework(
                    sc.runtimeIndexSkeleton,
                    `${sc.runtimeDir}/src`,
                    {name: sub.name},
                    {overwrite: true}
                );

            });

        }

        /**
         * 遍历模板目录生成模板文件
         *
         * @param {string} dir 模板路径
         * @param {string} dest 目标路径
         * @param {object} module 模板参数
         * @param {object} options 配置
         */
        function resolveFramework(dir, dest, module, options) {
            options = options || {};
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
                    let targetPath = `${dest}/${targetName}`;
                    if (!fss.existsSync(targetPath) || options.overwrite) {
                        fss.outputFileSync(targetPath, template);
                        let str = options.overwrite ? '覆盖文件' : '创建文件';
                        log.info(identifier, str + targetPath);
                    }
                } else {
                    fss.ensureDirSync(dest);
                    resolveFramework(fileRealPath, `${dest}/${filename}`, module);
                }
            });
        }
    }
};

module.exports = handler;
