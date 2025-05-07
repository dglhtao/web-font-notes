// https://leetcode.cn/problems/longest-valid-parentheses/description/

// 题解：动态规划
// 只有两种情况：括号并列、括号内嵌，并列判断()，内嵌判断))，并列直接加2；内嵌则判断子串的左边界的左边是否为(，不为(则内嵌不成立置0
// 动态转移方程：dp[i]是以s[i]结尾的最长合法长度。
// s[i] 为 ( 时，dp[i] = 0
// s[i] 为 ) 时，判断s[i-1]:
//   s[i-1] 为 ( 时，dp[i] = dp[i-2] + 2
//   s[i-1] 为 ) 时，判断 s[i-dp[i-1]-1]：
//     s[i-dp[i-1]-1] 为 ( 时，dp[i] = dp[i-dp[i-1]-2] + dp[i-1] + 2
//     s[i-dp[i-1]-1] 为 ) 时，说明再之前也无有效长度，终止并设dp[i] = 0

/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
  let dp = [], max = 0
  Array.from(s).forEach((chr, index) => {
      if (index === 0) dp[index] = 0
      else if (chr === '(') dp[index] = 0
      else {
          if (s[index - 1] === '(') {
              dp[index] = (dp[index - 2] || 0)  + 2
          } else {
              if (s[index - dp[index - 1] - 1] === '(') {
                  dp[index] = (dp[index - dp[index - 1] - 2] || 0) + dp[index - 1] + 2
              } else dp[index] = 0
          }
          if (dp[index] > max) max = dp[index]
      }
  })
  return max
};
