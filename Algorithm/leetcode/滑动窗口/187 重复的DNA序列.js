// https://leetcode.cn/problems/repeated-dna-sequences/description/

// 题解：定长窗口滚动记录，长度为10的内容为4种字符的字符串，转换为4进制数（减少存储空间和比较耗时）

/**
 * @param {string} s
 * @return {string[]}
 */
var findRepeatedDnaSequences = function(s) {
  const map = { A: 0, C: 1, G: 2, T: 3 }
  const reMap = ['A', 'C', 'G', 'T']
  const times = {}
  const four10 = 1 << 2 * 10
  let now = 0
  Array.from(s).forEach((chr, index) => {
      now = ((now << 2) + map[chr]) % four10
      if (index >= 9) {
          times[now] ? times[now]++ : times[now] = 1
      }
  })
  const arr = []
  Object.keys(times).forEach(item => {
      if (times[item] >= 2) {
          let num = item
          let key = ''
          for (let i = 0; i < 10; i++) {
              key = reMap[num % 4] + key
              num = num >> 2
          }
          arr.push(key)
      }
  })
  return arr
};