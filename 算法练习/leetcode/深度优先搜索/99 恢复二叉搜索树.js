// https://leetcode.cn/problems/recover-binary-search-tree/description/

// 题解：中序遍历获取排序顺序，一层for发现有序队列中两个异常点，交换异常点的值复原二叉搜索树

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
 * @return {void} Do not return anything, modify root in-place instead.
 */
var recoverTree = function(root) {
  // console.log('root', root, Object.keys(root))
  const arr = []
  // 中序遍历获取列表
  const getArrByMid = function (node) {
      if (node.left) { getArrByMid(node.left) }
      arr.push(node)
      if (node.right) { getArrByMid(node.right) }
  }
  getArrByMid(root)
  // console.log('arr0', arr)
  const arr2 = arr.map(item => item.val)
  let x = -1, y = -1
  for (let i = 0; i < arr2.length - 1; i++) {
      if (arr2[i] >= arr2[i+1]) {
          if (x === -1) {
              x = i
              y = i + 1
          } else {
              y = i + 1
          }
      }
  }
  if (x !== -1) {
      let xNode = arr[x]
      let yNode = arr[y]
      let swapVal = xNode.val
      xNode.val = yNode.val
      yNode.val = swapVal
  }
  // console.log(arr)
  return root
};