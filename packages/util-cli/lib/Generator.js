// lib/Generator.js
const util = require('util')
const ora = require('ora')
const chalk = require('chalk')
const downloadGitRepo = require('download-git-repo')
const fs = require('fs')
const path = require('path')

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message)
  // 开始加载动画
  spinner.start()

  try {
    // 执行传入方法 fn
    const result = await fn(...args)
    // 状态为修改为成功
    spinner.succeed()
    return result
  } catch (error) {
    // 状态为修改为失败
    spinner.fail('Request failed, refetch ...')
    return 'error'
  }
}

class Generator {
  constructor(name, targetDir, needWebpack) {
    // 目录名称
    this.name = name
    // 创建位置
    this.targetDir = targetDir
    // 是否需要webapck文件
    this.isNeedWebapck = needWebpack

    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  async download() {
    const requestUrl = '192114/cli-template#main'

    await wrapLoading(this.downloadGitRepo, '等待下载模版', requestUrl, this.targetDir)
  }

  // 核心创建逻辑
  async create() {
    const result = await this.download()
    console.log(result)
    // 成功返回undefined 失败返回'error'
    if (result !== 'error') {
      // fs.unlink(path.join(this.targetDir, 'LICENSE'))
      // fs.unlink(path.join(this.targetDir, 'README.md'))
      if (!this.isNeedWebapck) {
        fs.unlinkSync(path.join(this.targetDir, 'src', 'index.jsx'))
        fs.unlinkSync(path.join(this.targetDir, 'public', 'index.html'))
        fs.unlinkSync(path.join(this.targetDir, 'webpack.dev.js'))
        fs.unlinkSync(path.join(this.targetDir, 'webpack.prod.js'))
        fs.rmdirSync(path.join(this.targetDir, 'src'))
        fs.rmdirSync(path.join(this.targetDir, 'public'))

        fs.writeFileSync(path.join(this.targetDir, 'index.js'), '// 文件入口')
      }

      const packageName = `@${this.name.replace('-', '/')}`

      console.log(`\r\n创建成功 ${chalk.cyan(this.name)}`)
      console.log(`\r\n${chalk.red(`建议将package.json中的name改为${packageName}的格式`)}`)
      if (this.isNeedWebapck) {
        console.log(`\r\n启动项目 ${chalk.cyan(`yarn workspace ${packageName} start`)}`)
        console.log(`\r\n构建项目 ${chalk.cyan(`yarn workspace ${packageName} build`)}`)
      }
      console.log('Happy Coding 😊\r\n')
    }
  }
}

module.exports = Generator
