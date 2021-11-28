/**
 * 比较版本号 v1 === v2 ===> true
 * @param v1 版本号1
 * @param v2 版本号2
 * @returns -1 版本号1小于版本号2 0 相等 1 版本号1大于版本号2
 */
export const diffVersion = (v1 = '', v2 = '') => {
  const arr1 = v1.toString().split('.');
  const arr2 = v2.toString().split('.');

  const minLen = Math.min(arr1.length, arr2.length);

  let diff = 0; // 当前为位比较是否相等

  let flag = 0;

  // 逐个比较如果当前位相等则继续比较下一位
  for (let i = 0; i < minLen; i++) {
    diff = parseInt(arr1[i]) - parseInt(arr2[i]);
    if (diff === 0) {
      flag = 0;
      continue;
    } else if (diff > 0) {
      flag = 1;
      break;
    } else if (diff < 0) {
      flag = -1;
      break;
    }
  }

  return flag;
};
