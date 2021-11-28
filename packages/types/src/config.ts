import { Argv } from '.'

export interface IPlugin {
  developPlugin?: {
    start?: (argv?: Argv) => void
    build?: (argv?: Argv) => void
  }
}

export interface IUserConfig {
  // 打包后的模块名
  name?: string
  isDeclaration?: boolean
  port?: number
  distDirName?: string
  https?: boolean
  isDev?: boolean
}

export interface IConfig {
  moduleName: string
  isDeclaration: boolean
  port: number
  distDirName: string
  https: boolean
  isDev: boolean
}

export interface IAnswers {
  version: string
  customVersion: string
  commitMessage: string
}
