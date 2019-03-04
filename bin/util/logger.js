
const logger = require('loglevel');
const chalk = require('chalk');

let handler = {
    info: function(identifer, msg) {
        handler.segLine(msg).forEach(line => {
            console.log(chalk.cyanBright.bold(identifer) + chalk.whiteBright('[INFO] ') + chalk.white(line));
        });
    },
    tip: function(identifer, msg) {
        handler.segLine(msg).forEach(line => {
            console.log(chalk.cyanBright.bold(identifer) + chalk.blue('[TIP] ') + chalk.white(line));
        });
    },
    warn: function(identifer, msg) {
        handler.segLine(msg).forEach(line => {
            console.log(chalk.cyanBright.bold(identifer) + chalk.yellow('[WARN] ') + chalk.white(line));
        });
    },
    error: function(identifer, msg) {
        handler.segLine(msg).forEach(line => {
            console.log(chalk.cyanBright.bold(identifer) + chalk.red('[ERROR] ') + chalk.white(line));
        });
    },

    segLine(msg) {
        return msg.toString().split(/\n/g).filter(line => !!line);
    }
};

module.exports = handler;
