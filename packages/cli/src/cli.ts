#!/usr/bin/env node
import { resolve } from 'path'
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { fork } from 'child_process'
import { publishMethods } from './publish'

const debug = require('debug')('mpc:cli')

const spinnerProcess = fork(resolve(__dirname, './spinner'))
const spinner = {
  start: () =>
    spinnerProcess.send({
      msg: 'start'
    }),
  stop: () =>
    spinnerProcess.send({
      msg: 'stop'
    })
}

yargs(hideBin(process.argv))
  .usage('Usage：mpc [command] <options>')
  .strict()
  .command('start', 'start the project', {}, async () => {
    spinner.start()

    const { loadPlugin } = await import('@mini-npm-cli/utils')

    debug('loadPlugin Start')
    const plugin = loadPlugin()

    spinner.stop()

    // 开始构建
    await plugin.developPlugin?.start?.()
  })
  .command('build', 'build the project', {}, async () => {
    spinner.start()

    const { loadPlugin } = await import('@mini-npm-cli/utils')

    debug('loadPlugin Start')
    const plugin = loadPlugin()

    spinner.stop()

    // 开始构建
    await plugin.developPlugin?.build?.()
  })
  .command('publish', 'publish the project', {}, async () => {
    publishMethods()
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .alias('h', 'help')
  .alias('v', 'version')
  .fail((msg, err) => {
    if (err) {
      console.log(err)
      spinner.stop()
      process.exit(1)
    }
    console.log(msg)
  })
  .parse()
