# monorepo

## yarn workspaces基础命令

### yarn install

安装所有依赖，包含子package依赖，如果子package之间存在相互依赖会通过创建 **`软链`** 的方式引用，而非npm下载，这里可能会影响webpack配置中使用 `node_modules` 做路径判断的地方

### 依赖树关系

```shell
yarn workspaces info
```

### 安装/删除依赖模块

```shell
  # packageA 安装 axios
  yarn workspace packageA add axios

  # packageA 移除 axios
  yarn workspace packageA remove axios
```

  > *packageA 是需要安装依赖的包名，即 package.json 中的 name 字段，而非目录名*


```shell
  # root package 安装 commitizen
  yarn add -W -D commitizen

  # root package 移除 commitizen
  yarn remove -W commitizen
```

### 运行单个 package 的scripts 命令

```shell
  # 运行packageA 的dev命令
  yarn workspace packageA dev
```

```shell
  # 这里是在每个工作区运行 run build 命令
  yarn workspaces run build
```

> Tips：这里运行命令的时候不会检测依赖树关系，只是 `package.json` 文件 `workspaces` 配置工作区逐个运行，这里推荐使用 `lerna build`


## lerna 命令

``` shell
  # 清除所用的 node_modules 目录
  lerna clean 

  # 显示修改内容 类似git diff
  lerna diff

  # 列出所有的子package
  lerna ls -l

  # 列出修改过的子package
  lerna changed

  # build 所有子package，​子package分别执行 build，--sort ​参数可以控制以拓扑排序规则执行命令
  lerna run --stream --sort build

  # lerna publish 的功能可以即包含version的工作，也可以单纯的只做发布操作
  lerna publish

  # lerna publish 会先调用 lerna version，再确定是否要发布到npm
  # from-git 基于当前git提交的软件包做发布，一般都是通过 lerna version 提交的版本
  lerna publish from-git

  # from-package 在注册表中不存在该版本的最新提交中发布程序包 （这个我没用过）
  lerna publish from-package

  # lerna version 的作用是进行 version bump，支持手动和自动两种模式
  # 手动确定版本 按着提示选择版本即可
  lerna version

  # 自动确定版本
  # 自动根据 conventional commit 规范确定版本
  # 存在feat提交： 需要更新minor版本
  # 存在fix提交： 需要更新patch版本
  # 存在BREAKING CHANGE提交： 需要更新大版本

  # 生成changelog文件以及根据commit来进行版本变动
  lerna version --conventional-commits

  # 生成changelog文件以及根据commit来进行版本变动,不提示用户输入版本
  lerna version --conventional-commits --yes
```

version 成功后会自动推送当前分支，可以结合配置 lerna.json文件 command 下 version字段 配置允许version的分支，commit 信息等
```
{
    "npmClient": "yarn",
    "useWorkspaces": true,
    "version": "0.0.1", 
    "command": {
        "version": {
            "allowBranch": "master",
            "exact": true,
            "ignoreChanges": [
                "**/*.md"
            ],
            "message": "build: release version %v"
        }
    }
}
```