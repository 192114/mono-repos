#! /usr/bin/env node

// #! 符号的名称叫 Shebang，用于指定脚本的解释程序

const program = require('commander')
const chalk = require('chalk')

program
  // 定义命令和参数
  .command('create')
  .description('create a new project')
  .on('--help', () => {
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan('zr <command> --help')} for detailed usage of given command\r\n`)
  })
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((options) => {
    // 在 create.js 中执行创建任务
    require('../lib/create.js')(options)
  })

program
  // 配置版本号信息
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

// 解析用户执行命令传入参数
program.parse(process.argv)
