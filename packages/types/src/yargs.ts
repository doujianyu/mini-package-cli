import * as yargs from 'yargs'

export type Argv = yargs.Arguments<{
  port: number
  https: boolean
}>
