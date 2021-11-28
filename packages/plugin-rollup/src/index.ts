import { rollup, RollupWatchOptions, watch } from 'rollup'

export function rollupPlugin() {
  return {
    name: 'plugin-rollup',
    async start() {
      process.env.NODE_ENV = 'development'

      const { commonConfig, outputs } = await import('./config/rollup.config')

      const bundle = await rollup(commonConfig)

      const outputsPromise = []

      for (const output of outputs) {
        outputsPromise.push(async () => await bundle.write(output))
      }

      for await (const outputCallback of outputsPromise) {
        outputCallback()
      }

      const watchOptions: RollupWatchOptions = {
        ...commonConfig,
        output: outputs,
        watch: {
          exclude: 'node_modules/**'
        }
      }

      watch(watchOptions)
    },
    async build() {
      process.env.NODE_ENV = 'production'

      const { commonConfig, buildOutputs } = await import(
        './config/rollup.config'
      )

      const bundle = await rollup(commonConfig)

      const outputsPromise = []

      for (const output of buildOutputs) {
        outputsPromise.push(async () => await bundle.write(output))
      }

      for await (const outputCallback of outputsPromise) {
        outputCallback()
      }
    }
  }
}
