// https://leetcode.cn/problems/binary-tree-level-order-traversal/description/

// 题解：直接BFS遍历

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
var levelOrder = function(root) {
  const result = []
  if (root) { result.push([root]) }
  else return result
  const BFS = function () {
      const arr = []
      result[result.length - 1].forEach(item => {
          if (!item) { return }
          if (item.left) { arr.push(item.left) }
          if (item.right) { arr.push(item.right) }
      })
      if (arr.length) {
          result.push(arr)
          BFS()
      }
  }
  BFS()
  return result.map(item => item.map(each => each ? each.val : each))
};