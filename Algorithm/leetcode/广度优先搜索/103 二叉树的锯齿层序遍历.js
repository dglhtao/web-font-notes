// https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/description/

// 题解：广搜模拟

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var zigzagLevelOrder = function(root) {
  if (!root) { return [] }
  const arr = []
  let lastList = []
  let oldDeep = -1
  let deep = 0
  while (deep !== oldDeep) {
      const list = []
      if (deep === 0) {
          list.push(root)
      } else {
          let first = 'left'
          let last = 'right'
          if (deep % 2 === 1) {
              first = 'right'
              last = 'left'
          }
          for (let i = lastList.length - 1; i >= 0; i--) {
              if (lastList[i][first]) {
                  list.push(lastList[i][first])
              }
              if (lastList[i][last]) {
                  list.push(lastList[i][last])
              }
          }
      }
      oldDeep = deep
      if (list.length) {
          deep++
          lastList = list
          arr.push(list.map(each => each.val))
      }
  }
  return arr
};