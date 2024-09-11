// https://leetcode.cn/problems/course-schedule/description/
// 题解：邻接表 + 深搜遍历有向图是否有环
// 遍历是否有环：每检测一个新点标记，并放入栈中，如果新点有边指向栈中已有的点，则存在环。末端的点所有相邻点都检测完则推出栈，栈每时刻都代表一条路径，能检测路径中所有的点是否在有环图结构中，所以凡是检测过的点不需要再次入栈。

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
  // 构建邻接表
  let lines = new Array(numCourses).fill(null).map(() => [])
  let inpNum = new Array(numCourses).fill(0)
  prerequisites.forEach(item => {
      const [x, y] = item
      lines[y].push(x)
      inpNum[x]++
  })

  let inStack = new Array(numCourses).fill(false)
  let hasPass = new Array(numCourses).fill(false)
  const hasCircle = function (x) {
      hasPass[x] = true
      inStack[x] = true
      for (let i = 0; i < lines[x].length; i++) {
          y = lines[x][i]
          if (inStack[y]) { return true }
          if (hasPass[y]) { continue }
          if (hasCircle(y)) { return true }
      }
      inStack[x] = false
      return false
  }
  if (inpNum.filter(item => !item).length === 0) { return false }
  const findIndex = inpNum.map((item, index) => !item ? index : -1).filter(item => item !== -1).findIndex(item => hasCircle(item))
  return findIndex === -1 && hasPass.filter(item => !item).length === 0
};