#! /usr/bin/env node
const packge = require('../package.json');

const program = require('commander');
const init = require('./init');

program.version(`${packge.name} - ${packge.version}`);

program
    .command('init')
    .description('初始化HBS本地环境')
    .action(init.onInit);

program
    .parse(process.argv);
