import * as ora from 'ora'
const spinner = ora('Start')

interface IMessage {
  msg: 'start' | 'stop'
}

process.on('message', ({ msg }: IMessage) => {
  if (msg === 'start') {
    spinner.start()
  } else {
    spinner.stop()
    process.exit()
  }
})
