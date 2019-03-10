
const chalk = require('chalk');

const prefix = chalk.magenta.bold;
const c_info = chalk.hex('#67dc2e');
const c_tip = chalk.hex('#1890ff');
const c_warn = chalk.hex('#faad14');
const c_error = chalk.hex('#f52a35');

let handler = {
    info: function(identifer, msg) {
        handler.segLine(msg).forEach(line => {
            console.log(prefix(identifer) + c_info('[info] ' + line));
        });
    },
    tip: function(identifer, msg) {
        handler.segLine(msg).forEach(line => {
            console.log(prefix(identifer) + c_tip('[tips] ' + line));
        });
    },
    warn: function(identifer, msg) {
        handler.segLine(msg).forEach(line => {
            console.log(prefix(identifer) + c_warn('[warn] ' + line));
        });
    },
    error: function(identifer, msg) {
        handler.segLine(msg).forEach(line => {
            console.log(prefix(identifer) + c_error('[error] ' + line));
        });
    },

    segLine(msg) {
        return msg.toString().split(/\n/g).filter(line => !!line);
    }
};

module.exports = handler;
