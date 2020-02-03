// 去两个数之前的随机数
function getRandomInt(range: [number, number]): number {
  return Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
}
// 判断数组里是否有相应值
export function inArray(arr: string[], target: string): boolean {
  return arr.indexOf(target) !== -1;
}
// 随机数组
export function shuffle<T>(array: T[]): T[] {
  const result = array.slice();
  for (let i = 0; i < result.length; i++) {
    // 0与i之前一个随机数
    const j = getRandomInt([0, i]);

    [result[i], result[j]] = [result[j], result[i]];
  }
  console.log('result :) ', result);

  return result;
}
