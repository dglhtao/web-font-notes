// https://leetcode.cn/problems/longest-palindromic-substring/description/

// 题解：
// 1、扩展法
// 2、动态规划 bool[start, end] = bool[start-1, end-1] & (s[start] === s[end])

/**
 * @param {string} s
 * @return {string}
 */
// 扩展法
var longestPalindrome = function(s) {
  if (s.length === 1) return s
  let max = 0, maxStr = ''
  for (let i = 0; i < s.length - 1; i++) {
      let x = i, y = i
      while (s[x] === s[y] && x > -1 && y < s.length) {
          x--; y++
      }
      if (y - x - 1 > max) {
          max = y - x - 1
          maxStr = s.slice(x + 1, y)
      }
      x = i, y = i + 1
      while (s[x] === s[y] && x > -1 && y < s.length) {
          x--; y++
      }
      if (y - x - 1 > max) {
          max = y - x - 1
          maxStr = s.slice(x + 1, y)
      }
  }
  return maxStr
};

// 动态规划
var longestPalindrome = function(s) {
  const n = s.length
  const arr = new Array(n).fill(null).map(() => new Array(n).fill(false))
  let max = 0, start = 0, end = 0
  for (let j = 0; j < n; j++) {
      for (let i = 0; i <= j; i++) {
          if (j - i + 1 === 1) arr[i][j] = true
          else if (j - i + 1 === 2) {
              if (s[i] === s[j]) arr[i][j] = true
          } else {
              arr[i][j] = arr[i + 1][j - 1] & (s[i] === s[j])
          }
          if (arr[i][j] && j - i + 1 > max) {
              max = j - i + 1
              start = i
              end = j
          }
      }
  }
  if (max > 0) return s.slice(start, end + 1)
  return ''
};