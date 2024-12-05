// https://leetcode.cn/problems/happy-number/description/

// 题解：判断时用Map

/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {
  const createNum = function (n) {
      return Array.from(String(n)).reduce((pre, cur) => {
          return pre + Math.pow(Number(cur), 2)
      }, 0)
  }
  const hisMap = {}
  while (!hisMap[n] && n !== 1) {
      hisMap[n] = true
      n = createNum(n)
  }
  return n === 1
};
