// https://leetcode.cn/problems/add-two-numbers/description/

// 题解：高精度加法的部分

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  let exp = 0
  let l3, result
  while (l1 || l2 || exp) {
    let val1 = l1 ? l1.val : 0
    let val2 = l2 ? l2.val : 0
    let val = Number(val1) + Number(val2) + exp
    exp = Math.floor(val / 10)
    val = val - exp * 10
    if (l3) {
      l3.next = new ListNode(val)
      l3 = l3.next
    } else {
      l3 = new ListNode(val)
      result = l3
    }
    l1 = l1 ? l1.next : null
    l2 = l2 ? l2.next : null
  }
  return result
};