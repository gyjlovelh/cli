

const utils = {

    /**
     * 运行本地命令
     * @param cmd
     * @param cmdDir
     */
    runCmd: function (cmd, cmdDir) {
        const childProcess = require('child_process');
        childProcess.execSync(cmd, {cmd: cmdDir, encoding: 'utf-8'})
    },

    interCmd: function (name, steps, cb) {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        let flowIdentifier = `[${name}]`;
        rl.setPrompt(`${flowIdentifier}是否进入${name}流程（y|n）`)
        rl.prompt();

        // 实行步数，
        let currentStep = 0;
        let currentStepInfo;
        // 初始化交互获取的对象
        let obj = [];

        // 是否允许下一步
        let flag = true;

        rl.on('line', (line) => {
            let info = line.trim();

            // 输入n表示退出，否则表示进入
            if (0 === currentStep && info && 'n' === info) {
                rl.close();
            }

            if (0 < currentStep) {
                if (info) {
                    obj[currentStepInfo.name] = info;
                    flag = true;
                    if ('selection' === currentStepInfo.type) {
                        `${flowIdentifier}【错误】请输入正确的选项`;
                        rl.prompt();
                        flag = false;
                    }
                } else if (currentStepInfo && (currentStepInfo.require || 'selection' === currentStepInfo.type)) {
                    console.log(`${flowIdentifier}【错误】选择必须输入！`);
                    rl.prompt();
                    flag = false;
                } else {
                    obj[currentStepInfo.name] = currentStepInfo.default;
                    flag = true;
                }
            }
        });

    }
};

module.exports = utils;