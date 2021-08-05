// lib/create.js

const path = require('path')

// fs-extra 是对 fs 模块的扩展，支持 promise 语法
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('../lib/Generator')

module.exports = async function (options) {
  // 执行创建命令

  // 当前命令行选择的目录
  const cwd = process.cwd()

  // 询问项目名称
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '请输入项目名称（exp: app-name）:',
      validate: async function (input) {
        if (!input || input.indexOf('-') < 0) {
          return '项目名称格式不正确（项目类别-项目名称<app-name>）'
        }

        return true
      },
    },
  ])

  // 需要创建的目录地址
  const targetDir = path.join(cwd, 'packages', projectName)

  // 目录是否已经存在？
  if (fs.existsSync(targetDir)) {
    // 是否为强制创建？
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      // 询问用户是否确定要覆盖
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '该文件名已存在，是否覆盖',
          choices: [
            {
              name: '覆盖',
              value: 'overwrite',
            },
            {
              name: '取消',
              value: false,
            },
          ],
        },
      ])

      if (!action) {
        return
      } else if (action === 'overwrite') {
        // 移除已存在的目录
        console.log('\r\nRemoving...')
        await fs.remove(targetDir)
      }
    }
  }

  // 询问生成项目条件
  const { needWebpack } = await inquirer.prompt([
    {
      name: 'needWebpack',
      type: 'confirm',
      message: '是否需要对应的wepack文件？',
      default: true,
    },
  ])

  const generator = new Generator(projectName, targetDir, needWebpack)

  generator.create()
}
