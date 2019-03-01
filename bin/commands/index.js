/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-27 21:53:51
 * @LastEditTime: 2019-03-01 18:24:34
 */
const {init} = require('./init');
const {ls} = require('./ls');
const {serve} = require('./serve');
const {install} = require('./install');
const {update} = require('./update');

module.exports = {
    init,
    ls,
    serve,
    install,
    update
};
