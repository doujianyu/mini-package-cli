import execa = require('execa')

export const binRun = async (
  bin: string,
  args: string[],
  opts: execa.Options = {}
): Promise<execa.ExecaChildProcess> => {
  return execa(bin, args, { stdio: 'inherit', ...opts })
}
