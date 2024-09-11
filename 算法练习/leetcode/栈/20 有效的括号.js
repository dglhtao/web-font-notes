// https://leetcode.cn/problems/valid-parentheses/description/

// 题解：用栈结构去匹配就行

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  const stack = []
  const map = { '(': ')', '[': ']', '{': '}' }
  return Array.from(s).findIndex(item => {
    if (['(', '[', '{'].includes(item)) {
      stack.push(item)
      return false
    }
    if ([')', ']', '}'].includes(item)) {
      return map[stack.pop()] !== item
    }
  }) === -1 && stack.length === 0
};