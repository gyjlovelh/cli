/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-27 22:36:17
 * @LastEditTime: 2019-03-04 21:16:35
 */

const fss = require('fs-extra');
const path = require('path');
const cp = require('child_process');
const log = require('../../util/logger');
const appConfig = require('../../util/app-config');

const identifier = '[启动] ';

const systemType = require('os').type();;

let handler = {
    serve: function(arg) {
        try {
            let args = ['serve'];
            // 自定义host
            arg.ip && args.push('--host', arg.ip);
            // 自定义端口
            arg.port && args.push('--port', arg.port);
    
            // runtime根目录
            const targetPath = `${appConfig.runtimePath}/${appConfig.selectedSub}/framework`;
    
            // 1.拷贝资源
            copyResource();
    
            // 2.生成index.html

            // 3.生成全局样式文件
            // 4.生成主题样式问题
            // 5.生成国际化文件
    
            // 6.运行runtime工程
            let serv;
            if (systemType === 'Windows_NT') {
                // 添加start会新开cmd窗口
                serv = cp.spawn('start ng', args, {cwd: targetPath, shell: 'cmd.exe'});
            } else {
                serv = cp.spawn('ng', args, {cwd: targetPath});
            }
            
            serv.stdout.on('data', data => log.info(identifier, data));
            serv.stderr.on('data', data => log.info(identifier, data));
            serv.on('error', err => {
                throw new Error(err)
            });
    
            // 7.开启文件改动监听
            // log.info(identifier, cp.execSync(`ng serve`, {cwd: targetPath}).stdout);
            fileChangeListener();
        } catch (err) {
            throw new Error(err);
        }
    
        // 监听文件变化
        function fileChangeListener() {
            const chokidar = require('chokidar');

            // 1-1.监听工作目录文件
            let workspace_dir = `${appConfig.sourceCodePath}/${appConfig.selectedSub}`;
            let watch_workspace = chokidar.watch(workspace_dir, {
                ignored: /(^|[\/\\])\../,
                persistent: true
            });

            watch_workspace
                .on('change', path => {
                    // 兼容windows系统
                    let file_path = path.replace(/\\/g, '/');

                    let file_module = file_path.split(`/${appConfig.selectedSub}/module/`)[1];

                    let target_path = `${appConfig.runtimePath}/${appConfig.selectedSub}/framework/node_modules/@bss_modules/${appConfig.selectedSub}/${file_module}`;
                    // 将变更文件复制到runtime环境

                    fss.copySync(file_path, target_path, {overwrite: true});
                    log.info('[构建]',  '文件发生变化：' + file_path + ' copy to: ' + target_path);
                })
                .on('error', error => log.error(identifier, error));
        }

        /**
         * 拷贝resource/config
         */
        function copyResource() {
            // 清空资源目录
            let dest = `${appConfig.runtimePath}/${appConfig.selectedSub}/framework/src/assets`;
            fss.emptyDirSync(dest);
            // 将resource目录下的config拷贝过来
            let target = `${appConfig.sourceCodePath}/${appConfig.selectedSub}/resource/config`;
            
            // 拷贝config配置
            fss.copySync(target, `${dest}/config`);
            log.info('[copy] ', '复制文件：' + target + ' => ' + `${dest}/config`);
            
        }
    }
};


module.exports = handler;

