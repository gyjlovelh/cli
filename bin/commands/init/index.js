/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-26 17:37:34
 * @LastEditTime: 2019-02-27 23:23:12
 */

const {
    exec,
    execSync
} = require('child_process');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

/**
 * 初始化WAF项目
 * 
 * @param {string} name 
 */
function init(sourcePath) {
    try {
        // 读取并解析 application.json 文件
        let application = fs.readFileSync(`${sourcePath}/application.json`, 'utf8');
        application = JSON.parse(application);
        application.sourcePath = sourcePath;
        fs.writeFileSync(path.join(__dirname, '../../config/application.json'), JSON.stringify(application, null, 4));

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

        // todo 初始化runtime环境

    } catch (err) {
        throw new Error(err);
    }
}

function initCommonSkeleton(rootPath) {
    mkdirSyncSafe(`${rootPath}/waf_common`);
    mkdirSyncSafe(`${rootPath}/waf_common/components`);
    mkdirSyncSafe(`${rootPath}/waf_common/modules`);
    mkdirSyncSafe(`${rootPath}/waf_common/resource`);
    mkdirSyncSafe(`${rootPath}/waf_common/services`);
}

function initChildSkeleton(child) {
    const root = `${application.sourcePath}`;
    mkdirSyncSafe(root);
    mkdirSyncSafe(`${root}/modules`);
    mkdirSyncSafe(`${root}/shared`);
    mkdirSyncSafe(`${root}/resource`);

    // todo 定制 SharedModule 模板
    writeFileSyncSafe(`${root}/shared/shared.module.ts`, ejs.render('// todo', {}));

    // 预制标准化组织目录
    ['components', 'constants', 'services', 'pipes',
        'enums', 'models', 'directives', 'entryComponents'
    ].forEach(dir => {
        mkdirSyncSafe(`${root}/shared/${dir}`);
    });

    // 初始化根模块
    writeFileSyncSafe(`${root}/${child.name}.module.ts`, 'this is module');
    writeFileSyncSafe(`${root}/${child.name}.component.ts`, 'this is module');
    writeFileSyncSafe(`${root}/${child.name}.router.ts`, 'this is module');
    // 写入tslint.json
    writeFileSyncSafe(`${root}/tslint.json`, '// todo');
    // 写入tsconfig.json
    writeFileSyncSafe(`${root}/tsconfig.json`, '// todo');
    // 写入package.json
    writeFileSyncSafe(`${root}/package.json`, '// todo');
    // 写入README.md
    writeFileSyncSafe(`${root}/README.md`, '// todo');

    // 解析子模块
    child.modules && child.modules.forEach(child_module => {
        const root = `${application.sourcePath}/waf_${child.name}/modules/${child_module.name}`;
        mkdirSyncSafe(root);
        writeFileSyncSafe(`${root}/${child_module.name}.module.ts`, 'this is module');
        writeFileSyncSafe(`${root}/${child_module.name}.component.ts`, 'this is module');
        writeFileSyncSafe(`${root}/${child_module.name}.router.ts`, 'this is module');

    });
}

function mkdirSyncSafe(path, options) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, options);
    }
}

function writeFileSyncSafe(file, data, options) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, data, options);
    }
}



module.exports = {
    init
}