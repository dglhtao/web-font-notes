// https://leetcode.cn/problems/binary-tree-inorder-traversal/description/

// 题解：直接模拟

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
 * @return {number[]}
 */
var inorderTraversal = function(root) {
  const arr = []
  if (!root) { return arr }
  if (root.left) { arr.push(...inorderTraversal(root.left)) }
  arr.push(root.val)
  if (root.right) { arr.push(...inorderTraversal(root.right)) }
  return arr
};