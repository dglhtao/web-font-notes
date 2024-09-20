// https://leetcode.cn/problems/integer-to-roman/description/

// 题解：直接模拟

/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function(num) {
  let str = num.toString()
  if (str.length < 4) { str = '0'.repeat(4 - str.length) + str }
  const one = ['M', 'C', 'X', 'I']
  const five = ['', 'D', 'L', 'V']
  let result = ''
  for (let i = 0; i < str.length; i++) {
      if (str[i] === '0') { continue }
      let num = Number(str[i])
      if (num === 4) {
          result += one[i] + five[i]
          continue
      }
      if (num === 9) {
          result += one[i] + one[i - 1]
          continue
      }
      if (num >= 5) {
          result += five[i]
          num -= 5
      }
      if (num > 0) {
          result += one[i].repeat(num)
      }
  }
  return result
};