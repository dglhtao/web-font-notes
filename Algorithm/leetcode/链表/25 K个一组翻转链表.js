// https://leetcode.cn/problems/reverse-nodes-in-k-group/description/

// 题解：递归模拟每组翻转，空间复杂度O(1)，但要考虑的细节过多
//       用数组记录缓存每次翻转部分，空间复杂度O(n)，不容易出错

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
// var reverseKGroup = function(head, k) {
//   if (k === 1) { return head }
//   let head2 = null
//   let last = null
//   const func = function (now, num) {
//       if (!now.next) {
//           return now.next
//       }
//       if (num + 1 === k) {
//           let next = now.next
//           let next2 = next.next
//           next.next = now
//           if (!head2) { head2 = next }
//           if (last) { last.next = next }
//           if (num === 1) {
//               last = now
//               now.next = next2
//           }
//           return next2 || false
//       } else {
//           let next2 = func(now.next, num + 1)
//           if (next2 === null || next2 === undefined) { return }
//           let next = now.next
//           next.next = now
//           if (num === 1) {
//               last = now
//               now.next = next2 || null
//           }
//           return next2
//       }
//   }
//   let next = func(head, 1)
//   while (next) {
//       next = func(next, 1)
//   }
//   return head2
// };

var reverseKGroup = function(head, k) {
  let node = head
  let last = null
  let head2 = null
  let arr = []
  while (node) {
    arr.push(node)
    if (arr.length === k) {
      let start = arr[arr.length - 1]
      if (!head2) { head2 = start } 
      let next = start.next
      if (last) { last.next = start }
      for (let i = arr.length - 1; i > 0; i--) {
        arr[i].next = arr[i - 1]
      }
      arr[0].next = next
      last = arr[0]
      node = next
      arr = []
    } else {
      node = node.next
    }
  }
  return head2 || head
};