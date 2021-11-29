// path 模块
const path = require('path')
// 解析外部模块 也就是 npm 包
import resolve from '@rollup/plugin-node-resolve'
// TS 插件
const typescript = require('rollup-plugin-typescript2')
// import { terser } from 'rollup-plugin-terser'
// import clear from 'rollup-plugin-clear'

// 可视化分析 Rollup 包, 查看哪些模块占用了空间
import { visualizer } from 'rollup-plugin-visualizer'
import { InputOptions, OutputOptions, Plugin } from 'rollup'
import { getCwd, loadConfig } from '@mini-npm-cli/utils'

const cleanup = require('rollup-plugin-cleanup')
// 添加 json 文件导入支持
const json = require('@rollup/plugin-json')
// 将 commonJS 模块转换为 ES6 （解析commonjs模块使用）
const commonjs = require('@rollup/plugin-commonjs')
// 开发时启动服务
const serve = require('rollup-plugin-serve')
// 压缩代码
const { uglify } = require('rollup-plugin-uglify')

const getPathFile = (pathName: string): string => {
  return path.resolve(getCwd(), pathName)
}

const userConfig = loadConfig()
// 版本号
const V = require(getPathFile('./package.json')).version
// 模块名称
const M = userConfig.moduleName
// 是否生成声明文件
const isDeclaration = userConfig.isDeclaration
// 是否是开发模式
const isDev = userConfig.isDev
// 开发模式时的端口
const port = userConfig.port
// 打包的文件位置
const distDir = userConfig.distDirName
// 是否是HTTPS
const https = userConfig.https

export const commonConfig: InputOptions = {
  input: getPathFile('./src/index.ts'),
  plugins: [
    resolve({
      browser: true
    }),
    visualizer({
      title: `${M} analyzer`,
      filename: 'analyzer.html'
    }),
    commonjs({
      exclude: 'node_modules'
    }),
    json(),
    cleanup({
      comments: 'none'
    }),
    typescript({
      tsconfig: 'tsconfig.build.json',
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: isDeclaration,
          declarationMap: isDeclaration,
          declarationDir: `${distDir}/types/`, // 类型声明文件的输出目录
          module: 'ES2015'
        }
      },
      include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)']
    }),
    ...(isDev
      ? [
          serve({
            port,
            contentBase: [
              getPathFile('./example'),
              getPathFile(`./${distDir}`)
            ],
            https: https
          })
        ]
      : [])
  ],
  external: [...(userConfig.external || [])]
}

export const outputs: OutputOptions[] = [
  {
    file: getPathFile(`./${distDir}/lib/index.js`),
    sourcemap: true,
    format: 'cjs',
    banner: `/* ${M} version: '${V} */`
  },
  {
    file: getPathFile(`./${distDir}/es/index.js`),
    sourcemap: true,
    format: 'es',
    banner: `/* ${M} version: '${V} */`
  },
  {
    file: getPathFile(`./${distDir}/index.js`),
    sourcemap: true,
    format: 'umd',
    name: M,
    banner: `/* ${M} version: '${V} */`
  }
]

export const buildOutputs: OutputOptions[] = [
  {
    file: getPathFile(`./${distDir}/lib/index.js`),
    sourcemap: true,
    format: 'cjs',
    banner: `/* ${M} version: '${V} */`,
    plugins: [
      ...(commonConfig.plugins as Array<false | Plugin | null | undefined>),
      uglify()
    ]
  },
  {
    file: getPathFile(`./${distDir}/es/index.js`),
    sourcemap: true,
    format: 'es',
    banner: `/* ${M} version: '${V} */`,
    plugins: [
      ...(commonConfig.plugins as Array<false | Plugin | null | undefined>),
      uglify()
    ]
  },
  {
    file: getPathFile(`./${distDir}/index.js`),
    sourcemap: true,
    format: 'umd',
    name: M,
    banner: `/* ${M} version: '${V} */`,
    plugins: [
      ...(commonConfig.plugins as Array<false | Plugin | null | undefined>),
      uglify()
    ]
  }
]
