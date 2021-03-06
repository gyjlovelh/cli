/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-26 17:37:34
 * @LastEditTime: 2019-03-13 11:31:54
 */
'use strict';

const inquirer = require('inquirer');
const fss = require('fs-extra');
const os = require('os');
const log = require('../../util/logger');
const appConfig = require('../../util/app-config');
const func = require('../../util/func');
const skeleton = require('../../skeleton/skeleton');
const cp = require('child_process');
const cache = require('../../util/cache');

const identifier = '[init] ';

const winSourceCodePath = 'd:/workspace/sourceCode';
const osSourceCodePath = '/Users/guanyj/workspace/sourceCode';

const winVirtualPath = 'd:/workspace/runtime';
const osVirtualPath = '/Users/guanyj/workspace/runtime';

let handler = {
    init: function () {
        try {
            let defaultSourceCodePath = '';
            log.info(identifier, '当前操作为' + os.type());
            if (os.type() === 'Windows_NT') {
                // windows
                defaultSourceCodePath = winSourceCodePath;
            } else {
                // MacOs
                defaultSourceCodePath = osSourceCodePath;
            }
            let steps = [{
                type: 'input',
                message: '请输入产品工作空间路径',
                name: 'sourceCodePath',
                default: defaultSourceCodePath
            }];
            inquirer.prompt(steps).then(handleInit);
        } catch (err) {
            log.error(identifer, err);
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
            let commonConf = func.getSubConf('common');
            fss.ensureDirSync(commonConf.moduleDir);
            fss.ensureDirSync(commonConf.componentDir);
            fss.ensureDirSync(commonConf.serviceDir);
            fss.ensureDirSync(commonConf.resourceDir);
            cache.scanCommonElement();

            // 3.生成子应用工程
            func.getAppConf().subs.forEach(sub => {
                let sc = func.getSubConf(sub.name);
                // 模板配置信息

                // 3.1 生成子应用module工程
                skeleton.resolveFramework(sc.moduleSkeleton, sc.moduleDir, sc);

                // 3.1 生成子应用shared工程
                skeleton.resolveFramework(sc.sharedSkeleton, sc.sharedDir, sc);

                // 3.1 生成子应用resource工程
                skeleton.resolveFramework(sc.resourceSkeleton, sc.resourceDir, sc);

            });

            // 4.生成运行环境骨架
            func.getAppConf().subs.forEach(sub => {
                let sc = func.getSubConf(sub.name);
                fss.ensureDirSync(sc.runtimeDir);

                // 首次创建运行环境骨架
                if (!fss.existsSync(`${sc.runtimeDir}/package.json`)) {
                    log.info(identifier, cp.execSync(`ng new framework --skip-install --skip-git --skip-commit --style=scss --skip-tests --prefix ${sc.production}`, {cwd: sc.runtimeRootDir}));
                }
                const pkg = fss.readJSONSync(`${sc.runtimeDir}/package.json`);

                // 写入UI框架
                pkg.dependencies[`ng-zorro-antd`] = `^7.5.1`;
                pkg.dependencies[`echarts`] = `^4.2.1`;
                pkg.dependencies[`lodash`] = `^4.17.14`;
                pkg.dependencies[`ngx-echarts`] = `^4.2.1`;



                // 写入平台公共模块
                func.getPlatformDependencies().forEach(key => {
                    pkg.dependencies[key] = '~1.0.0';
                });

                // 写入子应用模块
                pkg.dependencies[sc.modulePkg] = '~1.0.0';
                pkg.dependencies[sc.sharedPkg] = '~1.0.0';
                pkg.dependencies[sc.resourcePkg] = '~1.0.0';

                // 修正 rxjs@6.4.0 无法正常启动BUG
                // pkg.dependencies.rxjs = `^6.0.0`;

                fss.outputJSONSync(`${sc.runtimeDir}/package.json`, pkg, {spaces: 4});
                log.info(identifier, '[修改文件] ' + `${sc.runtimeDir}/package.json`);

                // 3.渲染 /src/app 模板文件
                let subModule = func.getSubConf(sub.name);
                sub.filePrefix = sub.name;

                skeleton.resolveFramework(
                    sc.runtimeAppSkeleton,
                    `${sc.runtimeDir}/src/app`,
                    subModule,
                    {overwrite: true}
                );

                // 4.覆盖tsconfig.json
                let includeModule = [
                    sc.modulePkg,
                    sc.sharedPkg,
                    sc.resourcePkg,
                    ...func.getPlatformDependencies()
                ];
                skeleton.resolveFramework(
                    sc.runtimeTsconfigSkeleton,
                    sc.runtimeDir,
                    {include: includeModule},
                    {overwrite: true}
                );

                // 5.覆盖index.html
                skeleton.resolveFramework(
                    sc.runtimeIndexSkeleton,
                    `${sc.runtimeDir}/src`,
                    {name: sub.name},
                    {overwrite: true}
                );

                // 6.引入ng-zorro-antd 引入样式与 SVG 资源
                let ngJson = fss.readJSONSync(`${sc.runtimeDir}/angular.json`);

                ngJson.projects.framework.architect.build.options.assets = [
                    "src/favicon.ico",
                    "src/assets",
                    {
                        "glob": "**/*",
                        "input": "./node_modules/@ant-design/icons-angular/src/inline-svg/",
                        "output": "/assets/"
                    }
                ];

                ngJson.projects.framework.architect.build.options.styles = [
                    "src/styles.scss",
                    "node_modules/ng-zorro-antd/ng-zorro-antd.min.css",
                    "node_modules/@orchid_component/icon/assets/global.scss"
                ];
                fss.outputJSONSync(`${sc.runtimeDir}/angular.json`, ngJson, {spaces: 4});

            });

        }
    }
};

module.exports = handler;
