import { IConfig } from '@mpc/types';
import { getUserConfig } from './cwd';

const loadConfig = (): IConfig => {
  const userConfig = getUserConfig();
  const moduleName = userConfig.name ?? 'mpcModule';
  const port = userConfig.port ?? 8080;
  const isDeclaration = userConfig.isDeclaration ?? true;
  const distDirName = userConfig.distDirName ?? 'dist';
  const https = userConfig.https ?? false;
  const isDev = userConfig.isDev ?? process.env.NODE_ENV === 'development';

  const config: IConfig = {
    moduleName,
    isDeclaration,
    port,
    distDirName,
    https,
    isDev
  };

  return config;
};

export { loadConfig };
