/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-27 22:36:17
 * @LastEditTime: 2019-03-05 16:56:42
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

            // 3.引入全局样式文件
            importGlobalStyle();

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
            serv.stderr.on('data', data => log.error(identifier, data));
            serv.on('error', err => {
                throw new Error(err)
            });

            // 7.开启文件改动监听
            fileChangeListener();
        } catch (err) {
            throw new Error(err);
        }

        // 监听文件变化
        function fileChangeListener() {
            const chokidar = require('chokidar');

            /** 1.监听module目录 */
            moduleListener();

            /** 2.监听shared目录 */
            sharedListender();

            function moduleListener() {
                // 1-1.监听module工作目录文件
                let listen_dir = `${appConfig.sourceCodePath}/${appConfig.selectedSub}/module`;
                let $watch = chokidar.watch(listen_dir, {
                    ignored: /(^|[\/\\])\../,
                    persistent: true
                });

                $watch.on('change', path => {
                        // 兼容windows系统
                        path = path.replace(/\\/g, '/');
                        let dest = path.split(`/${appConfig.selectedSub}/module/`)[1];
                        let dest_path = `${appConfig.runtimePath}/${appConfig.selectedSub}/framework/node_modules/@bss_modules/${appConfig.selectedSub}/${dest}`;
                        // 将变更文件复制到runtime环境
                        fss.copySync(path, dest_path, {overwrite: true});
                        log.info('[构建]',  '文件发生变化：' + path + ' -> ' + dest_path);
                    })
                    .on('error', error => log.error(identifier, error));
            }

            function sharedListender() {
                // 1-1.监听module工作目录文件
                let listen_dir = `${appConfig.sourceCodePath}/${appConfig.selectedSub}/shared`;
                let $watch = chokidar.watch(listen_dir, {
                    ignored: /(^|[\/\\])\../,
                    persistent: true
                });

                $watch.on('change', path => {
                    // 兼容windows系统
                    path = path.replace(/\\/g, '/');
                    let dest = path.split(`/${appConfig.selectedSub}/shared/`)[1];
                    let dest_path = `${appConfig.runtimePath}/${appConfig.selectedSub}/framework/node_modules/@bss_shared/${appConfig.selectedSub}/${dest}`;
                    // 将变更文件复制到runtime环境
                    fss.copySync(path, dest_path, {overwrite: true});
                    log.info('[构建]',  '文件发生变化：' + path + ' -> ' + dest_path);
                }).on('error', error => log.error(identifier, error));
            }
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

        /**
         * 引入全局样式
         */
        function importGlobalStyle() {
            let module = {
                globalStyles: [
                    `@bss_resource/${appConfig.selectedSub}`
                ]
            };

            let dest = `${appConfig.runtimePath}/${appConfig.selectedSub}/framework/src/style.scss`;
            let art = require('art-template');
            const temp = art.render(fss.readFileSync(path.join(__dirname, '../../skeleton/runtime_style/style.scss.art')).toString(), {module});
            fss.outputFileSync(dest, temp);
            log.info(identifier, '引入全局样式成功' + dest);
        }
    }
};


module.exports = handler;

