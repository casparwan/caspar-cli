#! /usr/bin/env node
let program = require('commander');
let inquirer = require('inquirer');
let package = require('./package.json');
let download = require('download-git-repo');
//var exec = require('child_process').exec;
const fs = require('fs');
const handlebars = require('handlebars');
const ora = require('ora'); // 加载loading
const chalk = require('chalk'); // 美化样式
const symbols = require('log-symbols'); // 成功,失败图标


program
    .version(package.version, '-v --version')
    .command('init <name>')
    .description('初始化一个项目')
    .action(function(name){
        if (!fs.existsSync(name)) {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'author',
                    message: '请输入作者姓名'
                },
                {
                    type: 'input',
                    name: 'description',
                    message: '请输入项目描述'
                }
            ]).then(function (answer) {
                const spinner = ora('正在下载模板...');
                spinner.start();
                download('casparwan/xiaofan', name, (err) => {
                    if (err) {
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    } else {
                        spinner.succeed();
                        const meta = {
                            name,
                            author: answer.author,
                            description: answer.description
                        };
                        const filename = `${name}/package.json`;
                        const content = fs.readFileSync(filename).toString();
                        const result = handlebars.compile(content)(meta);
                        fs.writeFileSync(filename, result);
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    }

                })
            })
        } else {
            console.log(symbols.error, chalk('项目已经存在'));
        }
        
        // exec('git clone https://github.com/casparwan/xiaofan.git', function (error, stdout, stderr){
        //     if (error) {
        //         console.error('error: ' + error);
        //         return;
        //     }
        //     console.log('stdout: ' + stdout);
        //     console.log('stderr: ' + stderr);
        // })
    })

program.parse(process.argv);