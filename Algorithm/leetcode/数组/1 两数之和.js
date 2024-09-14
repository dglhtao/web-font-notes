// https://leetcode.cn/problems/two-sum/description/

// 题解：
// 1、排序 + 双指针法
// 2、哈希

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

// 1、排序 + 双指针法：时间O(nlogn) 空间O(n)
// var twoSum = function(nums, target) {
//   const arr = nums.map((item, index) => [item, index]).sort((b, a) => b[0] - a[0])
//   console.log('arr', arr)
//   let x = 0, y = arr.length - 1
//   let xx, yy
//   while (x < y) {
//     xx = arr[x][0]
//     yy = arr[y][0]
//     if (xx + yy === target) { return [arr[x][1], arr[y][1]] }
//     if (xx + yy > target) { y-- }
//     if (xx + yy < target) { x++ }
//   }
// };

// 2、哈希：时间O(n) 空间O(n)
var twoSum = function(nums, target) {
  const map = {}
  nums.forEach((item, index) => {
    map[item] = index // 建立map时相同数会覆盖保留后出现的，而遍历时又是从前开始，所以可处理重复数的情况
  })
  console.log('map', map)
  for (let x = 0; x < nums.length - 1; x++) {
    if (map[target - nums[x]] !== undefined && x !== map[target - nums[x]]) { return [x, map[target - nums[x]]] }
  }
};