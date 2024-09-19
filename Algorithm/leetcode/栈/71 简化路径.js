// https://leetcode.cn/problems/simplify-path/description/

// 题解：直接栈

/**
 * @param {string} path
 * @return {string}
 */
var simplifyPath = function(path) {
  const stack = []
  path.split('/').forEach(item => {
      if (item === '' || item === '.') { return }
      if (item === '..') {
          if (stack.length) {
              stack.pop()
          }
      } else {
          stack.push(item)
      }
  })
  return '/' + stack.join('/')
};