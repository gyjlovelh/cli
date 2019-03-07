/*
 * @Author: guanyj
 * @Email: 18062791691@163.com
 * @Date: 2019-02-27 22:36:17
 * @LastEditTime: 2019-03-07 12:38:04
 */

const fss = require('fs-extra');
const path = require('path');
const cp = require('child_process');
const log = require('../../util/logger');
const func = require('../../util/func');
const skeleton = require('../../skeleton/skeleton');
// const appConfig = require('../../util/app-config');

const identifier = '[serve] ';

const systemType = require('os').type();

let handler = {
    serve: function (arg) {
        // runtime根目录
        let sc = func.getCurSubConf();
        let cwd = sc.runtimeDir;
        try {
            let args = ['serve'];
            // 自定义host
            arg.ip && args.push('--host', arg.ip);
            // 自定义端口
            arg.port && args.push('--port', arg.port);



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
                serv = cp.spawn('start ng', args, {
                    cwd: cwd,
                    shell: 'cmd.exe'
                });
            } else {
                serv = cp.spawn('ng', args, {
                    cwd: cwd
                });
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
                let $watch = chokidar.watch(sc.moduleDir, {
                    ignored: /(^|[\/\\])\../,
                    persistent: true
                });

                $watch.on('change', path => {
                        // 兼容windows系统
                        path = path.replace(/\\/g, '/');
                        let dest = path.split(`/${sc.name}/module/`)[1];
                        let dest_path = `${sc.runtimeDir}/node_modules/${sc.modulePkg}}/${dest}`;
                        // 将变更文件复制到runtime环境
                        fss.copySync(path, dest_path, {
                            overwrite: true
                        });
                        log.info('[构建]', '文件发生变化：' + path + ' -> ' + dest_path);
                    })
                    .on('error', error => log.error(identifier, error));
            }

            function sharedListender() {
                // 1-1.监听module工作目录文件
                let $watch = chokidar.watch(sc.sharedDir, {
                    ignored: /(^|[\/\\])\../,
                    persistent: true
                });

                $watch.on('change', path => {
                    // 兼容windows系统
                    path = path.replace(/\\/g, '/');
                    let dest = path.split(`/${sc.name}/shared/`)[1];
                    let dest_path = `${sc.runtimeDir}/node_modules/${sharedPkg}}/${dest}`;
                    // 将变更文件复制到runtime环境
                    fss.copySync(path, dest_path, {
                        overwrite: true
                    });
                    log.info('[build]', '文件发生变化：' + path + ' -> ' + dest_path);
                }).on('error', error => log.error(identifier, error));
            }
        }

        /**
         * 拷贝resource/config
         */
        function copyResource() {
            // 清空资源目录
            let dest = `${sc.runtimeDir}/src/assets`;
            fss.emptyDirSync(dest);
            // 将resource目录下的config拷贝过来
            let target = `${sc.resourceDir}/config`;

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
                    sc.resourcePkg
                ]
            };
            skeleton.resolveFramework(
                path.join(__dirname, '../../skeleton/runtime_style'),
                `${sc.runtimeDir}/src`,
                module,
                {overwrite: true}
            );
            log.info(identifier, '引入全局样式成功' +  `${sc.runtimeDir}/src`);
        }
    }
};


module.exports = handler;
