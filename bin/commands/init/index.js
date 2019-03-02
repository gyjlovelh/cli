/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-26 17:37:34
 * @LastEditTime: 2019-03-02 12:45:03
 */

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const {
    renderNormalComponent, 
    renderFrameworkModule, 
    renderTsconfig, 
    renderSharedModule,
    renderTslint,
    renderFrameworkPackage,
    renderNormalModule,
    renderRoutingModule,
    renderFrameworkIndex
} = require('../../util/render');
const {publishFramework} = require('../../util/publish.util');
const {mkdirSyncSafe, writeFileSyncSafe} = require('../../util/fs-util');
const {anyToCamel, camelToLetter} = require('../../util/file-name.util');
const {useFramework} = require('../../util/runtime.util');

let application;

let applicationJsonPath = path.join(__dirname, '../../../config/application.json');
/**
 * 初始化WAF项目
 * 
 * @param {string} name 
 */
function init() {
    try {
        inquirer.prompt([
            {
                type: 'confirm', 
                message: '[初始化平台本地环境] 是否确认进入初始化流程(y|n)',
                name: 'abcd',
                default: true
            },
            {
                type: 'input',
                message: '[初始化平台本地环境] 请输入本地产品代码根路径',
                name: 'sourcePath'
            }
        ]).then(({sourcePath}) => {
            // 读取并解析 application.json 文件
            application = fs.readFileSync(`${sourcePath}/application.json`, 'utf8');
            application = JSON.parse(application);
            // 格式化应用名和模块名
            application.sourcePath = sourcePath;
            application.subs.forEach(child => {
                child.name = camelToLetter(anyToCamel(child.name));
                if (!child.modules) {
                    child.modules = [];
                }
                child.modules.forEach(mod => {
                    mod.name = camelToLetter(anyToCamel(mod.name));
                });
            });
            if (application.subs.length > 0) {
                application.selectedSub = application.subs[0].name;
            }
            fs.writeFileSync(applicationJsonPath, JSON.stringify(application, null, 4));

            // 初始化根模块tsconfig.json    
            writeFileSyncSafe(`${application.sourcePath}/tsconfig.json`,
                JSON.stringify({
                    compilerOptions: {
                        baseUrl: `${application.runtimePath}/node_modules`
                    }
                }, null, 4));

            // 初始化公共依赖工程骨架；
            initCommonSkeleton(application.sourcePath);

            // 初始化子应用工程骨架
            application.subs.forEach(child => initChildFrameworkSkeleton(child));

            // todo 初始化runtime环境【默认第一个子应用】
            useFramework(application, application.selectedSub);
                

        });
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * 初始化公共依赖工程
 * 
 * @param {string} rootPath 
 */
function initCommonSkeleton(rootPath) {
    mkdirSyncSafe(`${rootPath}/waf-common`);
    mkdirSyncSafe(`${rootPath}/waf-common/components`);
    mkdirSyncSafe(`${rootPath}/waf-common/modules`);
    mkdirSyncSafe(`${rootPath}/waf-common/resource`);
    mkdirSyncSafe(`${rootPath}/waf-common/services`);
}

/**
 * 初始化子应用骨架模板
 * 
 * @param {object} child 
 */
function initChildFrameworkSkeleton(child) {
    let fileName = camelToLetter(anyToCamel(child.name));
    let frameworkDir = `waf-${fileName}`;
    const root = `${application.sourcePath}/${frameworkDir}`;
    mkdirSyncSafe(root);
    mkdirSyncSafe(`${root}/modules`);
    mkdirSyncSafe(`${root}/shared`);
    mkdirSyncSafe(`${root}/resource`);

    // todo 定制 SharedModule 模板
    writeFileSyncSafe(`${root}/shared/shared.module.ts`, renderSharedModule());

    // 预制标准化组织目录
    ['components', 'constants', 'services', 'pipes',
        'enums', 'models', 'directives', 'entryComponents'
    ].forEach(dir => {
        mkdirSyncSafe(`${root}/shared/${dir}`);
    });

    // 初始化根模块
    writeFileSyncSafe(`${root}/${fileName}.module.ts`, renderFrameworkModule(child.name));
    writeFileSyncSafe(`${root}/index.ts`, renderFrameworkIndex(child.name));
    let componentTemplate = renderNormalComponent(child.name);
    writeFileSyncSafe(`${root}/${fileName}.component.scss`, componentTemplate.style);
    writeFileSyncSafe(`${root}/${fileName}.component.html`, componentTemplate.html);
    writeFileSyncSafe(`${root}/${fileName}.component.ts`, componentTemplate.typescript);
    writeFileSyncSafe(`${root}/${fileName}-routing.module.ts`, renderRoutingModule(child.name + '-routing'));
    // 写入tslint.json
    writeFileSyncSafe(`${root}/tslint.json`, renderTslint(application, frameworkDir));
    // 写入tsconfig.json
    writeFileSyncSafe(`${root}/tsconfig.json`, renderTsconfig(application, frameworkDir));
    // 写入package.json
    writeFileSyncSafe(`${root}/package.json`, renderFrameworkPackage(frameworkDir));
    // 写入README.md
    writeFileSyncSafe(`${root}/README.md`, '###' + fileName);

    // 解析子模块
    child.modules && child.modules.forEach(child_module => resolveChildModuleSkeleton(root, child_module));

    // 发布应用
    publishFramework(application, child.name);
}

/**
 * 解析子应用的子模块
 * 
 * @param {string} parentPath
 * @param {any} childModule 
 */
function resolveChildModuleSkeleton(parentPath, childModule) {
    const childRoot = `${parentPath}/modules/${childModule.name}`;
    mkdirSyncSafe(childRoot);
    let fileName = camelToLetter(anyToCamel(childModule.name));
    writeFileSyncSafe(`${childRoot}/${fileName}.module.ts`, renderNormalModule(childModule.name));
    let componentTemplate = renderNormalComponent(childModule.name);
    writeFileSyncSafe(`${childRoot}/${fileName}.component.scss`, componentTemplate.style);
    writeFileSyncSafe(`${childRoot}/${fileName}.component.html`, componentTemplate.html);
    writeFileSyncSafe(`${childRoot}/${fileName}.component.ts`, componentTemplate.typescript);
    writeFileSyncSafe(`${childRoot}/${fileName}-routing.module.ts`, renderRoutingModule(childModule.name + '-routing'));
}

module.exports = {
    init
};
