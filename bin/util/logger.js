
const logger = require('loglevel');
const chalk = require('chalk');

let handler = {
    info: function(identifer, msg) {
        console.log(chalk.cyanBright.bold(identifer) + chalk.whiteBright('[INFO] ') + chalk.white(msg));
    },
    tip: function(identifer, msg) {
        console.log(chalk.cyanBright.bold(identifer) + chalk.blue('[TIP] ') + chalk.white(msg));
    },
    warn: function(identifer, msg) {
        console.log(chalk.cyanBright.bold(identifer) + chalk.yellow('[WARN] ') + chalk.white(msg));
    },
    error: function(identifer, msg) {
        console.log(chalk.cyanBright.bold(identifer) + chalk.red('[ERROR] ') + chalk.white(msg));
    }
};

module.exports = handler;