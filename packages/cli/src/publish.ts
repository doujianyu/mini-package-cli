import { resolve } from 'path'
import { getCwd, binRun, diffVersion } from '@mini-npm-cli/utils'
import { IAnswers } from '@mini-npm-cli/types'

const inquirer = require('inquirer')
const fs = require('fs')
const { redBright, red, green, blue } = require('chalk')
const pckPath = resolve(getCwd(), './package.json')
const pckJson = require(pckPath)

// [当前的版本, 版本类型：内部版本alpha | 公测版本beta | 正式版本的候选版本rc | 正式版本]
const [version = '', versionType = ''] = (pckJson.version as string).split('-')

// [主版本号, 次版本号, 修订版本号]
const [major, minor, patch] = version.split('.').map(item => parseInt(item))

// [, 当前的版本号]
const [, curtVersion] = versionType.split('.')

// 处理版本号
const versions = [
  {
    name: `发布修订版本升级 ${[major, minor, patch + 1].join('.')}`,
    value: [major, minor, patch + 1].join('.'),
    checked: true
  },
  {
    name: `发布次版本升级 ${[major, minor + 1, 0].join('.')}`,
    value: [major, minor + 1, 0].join('.')
  },
  {
    name: `发布主版本升级 ${[major + 1, 0, 0].join('.')}`,
    value: [major + 1, 0, 0].join('.')
  },
  {
    name: `发布内部版本升级 ${[major, minor, patch].join('.')}-${[
      'alpha',
      (parseInt(curtVersion) || 0) + 1
    ].join('.')}`,
    value: `${[major, minor, patch].join('.')}-${[
      'alpha',
      (parseInt(curtVersion) || 0) + 1
    ].join('.')}`
  },
  {
    name: `发布公测版本升级 ${[major, minor, patch].join('.')}-${[
      'beta',
      (parseInt(curtVersion) || 0) + 1
    ].join('.')}`,
    value: `${[major, minor, patch].join('.')}-${[
      'beta',
      (parseInt(curtVersion) || 0) + 1
    ].join('.')}`
  },
  {
    name: `发布候选版本升级 ${[major, minor, patch].join('.')}-${[
      'rc',
      (parseInt(curtVersion) || 0) + 1
    ].join('.')}`,
    value: `${[major, minor, patch].join('.')}-${[
      'rc',
      (parseInt(curtVersion) || 0) + 1
    ].join('.')}`
  },
  {
    name: '自定义版本',
    value: 'customVersion'
  }
]

export const publishMethods = () => {
  console.log(redBright('即将发布新版本'))
  console.log(red('当前版本为: ', pckJson.version))

  inquirer
    .prompt([
      {
        name: 'version',
        message: '请选择要发布的版本',
        type: 'list',
        pageSize: 10,
        choices: versions
      },
      {
        name: 'customVersion',
        message: '请输入版本号',
        type: 'input',
        when: (answers: IAnswers) => answers.version === 'customVersion'
      },
      {
        name: 'commitMessage',
        message: '请输入 GIT 提交信息',
        type: 'input'
      }
    ])
    .then(async (answers: IAnswers) => {
      if (answers.version === 'customVersion') {
        const versionStatus = diffVersion(
          pckJson.version,
          answers.customVersion
        )

        if (versionStatus === -1) {
          pckJson.version = answers.customVersion
        } else {
          console.log(red('版本号等于当前或小于当前版本'))
          return false
        }
      } else {
        pckJson.version = answers.version
      }
      fs.writeFileSync(pckPath, JSON.stringify(pckJson, null, 2))

      console.log(green('版本号更新完成'))

      console.log(blue('自动推送当前版本修改 Start'))
      await binRun('git', [
        'commit',
        '-a',
        '-m',
        answers.commitMessage ??
          `Version release auto submit ${pckJson.version}`
      ])
      await binRun('git', ['push'])
      console.log(green('自动推送当前版本修改 Success'))

      console.log(blue('创建 tag Start'))
      await binRun('git', ['tag', pckJson.version])
      console.log(green('创建 tag Success'))

      console.log(blue('推送 tag Start'))
      await binRun('git', ['push', 'origin', pckJson.version])
      console.log(green('推送 tag Success'))

      console.log(blue('构建项目 Start'))
      await binRun('npm', ['run', 'build'])
      console.log(green('构建项目 Success'))

      console.log(blue('发布到 NPM Start'))
      await binRun('npx', ['npm', 'publish'])
      console.log(green('发布到 NPM Success'))
    })
}
