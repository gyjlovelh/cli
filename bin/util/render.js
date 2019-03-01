let ejs = require('ejs');
let fs = require('fs');
let path = require('path');
let {camelToLetter, anyToCamel} = require('./file-name.util');

/**
 * 渲染普通模板
 * 
 * @param {string} name 
 * @return {typescript, html, style}
 */
function renderNormalComponent(name) {
    name = anyToCamel(name);

    let $ts = fs.readFileSync(path.join(__dirname, '../templates/ts/normal.component.ejs'), 'utf8').toString();
    let $html = fs.readFileSync(path.join(__dirname, '../templates/html/normal.component.ejs'), 'utf8').toString();
    let $style = fs.readFileSync(path.join(__dirname, '../templates/style/normal.component.ejs'), 'utf8').toString();

    return {
        typescript: ejs.render($ts, {filePath: camelToLetter(name),className: name}),
        html: ejs.render($html, {}),
        style: ejs.render($style, {})
    };
}

/**
 * 渲染普通Module 模板
 * 
 * @param {string} name 
 */
function renderNormalModule(name) {
    name = anyToCamel(name);
    let $normalModule = fs.readFileSync(path.join(__dirname, '../templates/ts/normal.module.ejs'), 'utf8').toString();
    return ejs.render($normalModule, {className: name});
}

/**
 * 渲染路由配置 Module 模板
 * 
 * @param {string} name 
 */
function renderRoutingModule(name) {
    name = anyToCamel(name);
    let $routing = fs.readFileSync(path.join(__dirname, '../templates/ts/router.module.ejs'), 'utf8').toString();

    return ejs.render($routing, {className: name});
}

/**
 * 渲染 SharedModule 模块
 * @return {string}
 */
function renderSharedModule() {
    let $shared = fs.readFileSync(path.join(__dirname, '../templates/ts/shared.module.ejs'), 'utf8').toString();
    return ejs.render($shared, {});
}

/**
 * 渲染子应用根模块
 * 
 * 
 * @param {string} name 
 * @return {string}
 */
function renderFrameworkModule(name) {
    name = anyToCamel(name);
    let $module = fs.readFileSync(path.join(__dirname, '../templates/ts/framework.module.ejs'), 'utf8').toString();
    return ejs.render($module, {className: name});
}

/**
 * 渲染子应用导出点Index.ts文件
 * 
 * @param {string} name 
 */
function renderFrameworkIndex(name) {
    name = camelToLetter(anyToCamel(name));
    let $index = fs.readFileSync(path.join(__dirname, '../templates/ts/framework-index.ejs'), 'utf8').toString();

    return ejs.render($index, {modulePath: name});
}

/**
 * 渲染子应用模块的 tsconfig.json 文件
 * 
 * @param {object} application
 * @param {string} dirName 
 */
function renderTsconfig(application, dirName) {
    let $tsconfig = fs.readFileSync(path.join(__dirname, '../templates/json/tsconfig.ejs'), 'utf8').toString();
    $tsconfig = JSON.parse($tsconfig);
    $tsconfig.compilerOptions.baseUrl = `${application.runtimePath}/${dirName}/node_modules`;

    return JSON.stringify($tsconfig, null, 4);
}

/**
 * 渲染子应用模块的 tslint.json 文件
 * 
 * @param {object} application 
 * @param {string} dirName 
 */
function renderTslint(application, dirName) {
    let $tslint = fs.readFileSync(path.join(__dirname, '../templates/json/tslint.ejs'), 'utf8').toString();
    $tslint = JSON.parse($tslint);
    $tslint.rulesDirectory = [
        `${application.runtimePath}/${dirName}/node_modules/codelyzer`
    ];

    return JSON.stringify($tslint, null, 4);
}

/**
 * 渲染子应用 package.json 文件
 * 
 * @param {string} packageName 
 */
function renderFrameworkPackage(packageName) {
    let $package = fs.readFileSync(path.join(__dirname, '../templates/json/package.ejs'), 'utf8').toString();
    $package = JSON.parse($package);   
    $package.name = `@waf-modules/${packageName}`;
    // todo
    $package.version = '1.0.0';

    return JSON.stringify($package, null, 4);
}


module.exports = {
    renderNormalComponent,
    renderNormalModule,
    renderFrameworkModule,
    renderSharedModule,
    renderTsconfig,
    renderTslint,
    renderRoutingModule,
    renderFrameworkPackage,
    renderFrameworkIndex
};
