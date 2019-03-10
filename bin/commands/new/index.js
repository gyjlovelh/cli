'use strict';
const fnUtil = require('../../util/file-name.util');
const func = require('../../util/func');
const cache = require('../../util/cache');
const skeleton = require('../../skeleton/skeleton');

const schemas = ['service', 's', 'module', 'm', 'component', 'c'];

let handler = {

    doNew: function (schema, name) {
        let commonSc = func.getSubConf('common');
        try {
            if (!schemas.includes(schema)) {
                throw new Error(`当前模板不合法:${schema}, 正确模板名：『${schemas}』`);
            }
            if (name.length < 3 || (/[^a-zA-Z0-9_-]/g.test(name))) {
                throw new Error(`模块名称不合法：${name}，至少为三个字符，且不包含除_-之外的特殊字符`);
            }
            name = fnUtil.camelToLetter(fnUtil.anyToCamel(name));
          
            if (schema === 'service' || schema === 's') {
                doNewService(name);
            }
            if (schema === 'module' || schema === 'm') {
                doNewModule(name);
            }
            if (schema === 'component' || schema === 'c') {
                doNewComponent(name);
            }    
        } catch (error) {
            log.error(identifer, error);
        }
        
        function doNewService(name) {
            let module = Object.assign({}, commonSc);
            module.name = name;
            module.camelName = fnUtil.anyToCamel(name);
            skeleton.resolveFramework(
                commonSc.serviceSkeleton,
                `${commonSc.serviceDir}/${name}`,
                module
            );
            // 记录此服务
            cache.addElementToCommon('service', {
                name: name,
                descrition: '--'
            })
        }

        function doNewComponent(name) {
            let module = Object.assign({}, commonSc);
            module.name = name;
            module.camelName = fnUtil.anyToCamel(name);
            skeleton.resolveFramework(
                commonSc.componentSkeleton,
                `${commonSc.componentDir}/${name}`,
                module
            );
            // 记录此服务
            cache.addElementToCommon('component', {
                name: name,
                descrition: '--'
            })
        }

        function doNewModule(name) {
            let module = Object.assign({}, commonSc);
            module.name = name;
            module.camelName = fnUtil.anyToCamel(name);
            skeleton.resolveFramework(
                commonSc.moduleSkeleton,
                `${commonSc.moduleDir}/${name}`,
                module
            );
            // 记录此服务
            cache.addElementToCommon('module', {
                name: name,
                descrition: '--'
            })
        }
    },

    doRemove() {

    }

};

module.exports = handler;
