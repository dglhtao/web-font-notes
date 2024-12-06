// https://leetcode.cn/problems/symmetric-tree/description/

// 题解：递归法 或 迭代法

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
 * @return {boolean}
 */
var isSymmetric = function(root) {
  // 递归法
  const func = function(left, right) {
      if (!left || !right) return false
      if (left.val !== right.val) return false
      if (left.left || right.right) {
          if (!func(left.left, right.right)) return false
      }
      if (left.right || right.left) {
          if (!func(left.right, right.left)) return false
      }
      return true
  }
  if (!root || (!root.left && !root.right)) return true
  return func(root.left, root.right)
};

var isSymmetric = function(root) {
  // 迭代法
  if (!root || (!root.left && !root.right)) return true
  const arr = [root.left, root.right]
  while (arr.length) {
      const left = arr.shift()
      const right = arr.shift()
      if (!left || !right) return false
      if (left.val !== right.val) return false
      if (left.left || right.right) { arr.push(left.left, right.right) }
      if (left.right || right.left) { arr.push(left.right, right.left) }
  }
  return true
};