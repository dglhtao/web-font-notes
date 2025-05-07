// https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/

// 题解： 滚动记录取最大值

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  const map = {}
  let len = 0
  let maxLen = 0
  Array.from(s).forEach((chr, index) => {
      if (map[chr]) {
          while (len > 0) {
              map[s[index - len]] = 0
              if (s[index - len--] === chr) break
          }
      }
      map[chr] = 1
      len++
      if (len > maxLen) {
          maxLen = len
      }
  })
  return maxLen
};