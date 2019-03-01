const fs = require('fs');

/**
 * 同步创建文件夹
 * 
 * @param {string} path 
 * @param {object} options 
 */
function mkdirSyncSafe(path, options) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, options);
        console.log('[init] mkdir:' + path);
    }
}

/**
 * 同步写文件
 * 
 * @param {string} file 
 * @param {object} data 
 * @param {pbject} options 
 */
function writeFileSyncSafe(file, data, options) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, data, options);
        console.log('[init] touchFile:' + file);
    }
}

module.exports = {
    mkdirSyncSafe,
    writeFileSyncSafe
}
