const identifier = '[init]';
const utils = require('../common/utils');

const init = {
    onInit: function () {
        let steps = [
            {name: 'localCodePaths', prompt: '请输入本地产品代码跟路径', type: 'list'}
        ];

        utils.interCmd('初始化HBS本地环境', steps, obj => {
            console.log(obj);
        })
    }
};

module.exports = init;
