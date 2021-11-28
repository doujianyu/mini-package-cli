import { resolve } from 'path';
import { IPlugin, IUserConfig } from '@mpc/types';

// 获取执行路径
export const getCwd = (): string => {
  return resolve(process.cwd(), process.env.APP_ROOT ?? '');
};

// 读取插件配置
export const loadPlugin = (): IPlugin => {
  return require(resolve(getCwd(), 'plugin'));
};

// 读取用户配置
export const getUserConfig = (): IUserConfig => {
  return require(resolve(getCwd(), 'config'));
};
