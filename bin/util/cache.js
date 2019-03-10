'use strict';

const fss = require('fs-extra');
const path = require('path');
const func = require('./func');
const log = require('./logger');

const identifer = '[cache] ';

let handler = {

    /**
     * 记录common模块变化
     * @param {string} eleType 
     * @param {object} eleInfo 
     */
    addElementToCommon(eleType, eleInfo) {
        const commonJson = fss.readJSONSync(path.join(__dirname, '../../config/bss-common.json'));
        const curList = commonJson[eleType].list;
        if (curList.find(item => item.name === eleInfo.name)) {
            log.error(identifer, `${eleInfo.name}模块已经存在，请确认~`);
            return;
        }
        const commonSc = func.getSubConf('common');
        eleInfo.pkg = `${commonSc[`${eleType}PkgPrefix`]}/${eleInfo.name}`;
        eleInfo.author = `guanyj`;
        eleInfo.version = '1.0.0';
        if (eleType === 'component') {
            eleInfo.seletor = `${commonSc.production}-${eleInfo.name}`
        }
        curList.push(eleInfo);
        log.warn(identifer, `成功添加${eleInfo.name}模块`)
        fss.outputJSONSync(path.join(__dirname, '../../config/bss-common.json'), commonJson, {spaces: 4});
    },
    /**
     * 扫描common工程所有模块
     */
    scanCommonElement() {
        const commonSc = func.getSubConf('common');
        const commonJson = fss.readJSONSync(path.join(__dirname, '../../config/bss-common.json'));
        commonJson.module.list = [];
        commonJson.component.list = [];
        commonJson.service.list = [];
        // 1.扫描module工程
        const modules = fss.readdirSync(commonSc.moduleDir);
        log.info(identifer, '************************ 扫描common工程 start ************************');
        modules.forEach(mod => {
            let module = fss.readJSONSync(`${commonSc.moduleDir}/${mod}/package.json`);
            commonJson.module.list.push({
                name: mod,
                pkg: module.name,
                version: module.version,
                author: module.author
            });
            log.info(identifer, `| 读取: ${module.name}@${module.version} 模块信息至缓存~`)
        });

        // 2.扫描component工程
        const components = fss.readdirSync(commonSc.componentDir);
        components.forEach(mod => {
            let module = fss.readJSONSync(`${commonSc.componentDir}/${mod}/package.json`);
            commonJson.component.list.push({
                name: mod,
                pkg: module.name,
                version: module.version,
                author: module.author,
                selector: `${commonSc.production}-${mod}`
            });
            log.info(identifer, `| 读取: ${module.name}@${module.version} 模块信息至缓存~`)
        });

        // 3.扫描service工程
        const services = fss.readdirSync(commonSc.serviceDir);
        services.forEach(mod => {
            let module = fss.readJSONSync(`${commonSc.serviceDir}/${mod}/package.json`);
            commonJson.service.list.push({
                name: mod,
                pkg: module.name,
                version: module.version,
                author: module.author
            });
            log.info(identifer, `| 读取: ${module.name}@${module.version} 模块信息至缓存~`)
        });
        fss.outputJSONSync(path.join(__dirname, '../../config/bss-common.json'), commonJson, {spaces: 4});
        log.info(identifer, '************************ 扫描common工程 end ************************');
    }

}

module.exports = handler;