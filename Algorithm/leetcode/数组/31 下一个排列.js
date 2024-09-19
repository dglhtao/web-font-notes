// https://leetcode.cn/problems/next-permutation/description/

// 题解：找到规律下一个排列：第一个非降序位置换成下一大小的数字，随后的数升序

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function(nums) {
  let i = nums.length - 1
  while (i > 0 && nums[i - 1] >= nums[i]) { i-- }
  if (i === 0) { nums.sort((b, a) => Number(b) - Number(a)); return }
  i--
  let j = i + 1
  for (j = i + 1; j < nums.length; j++) {
    if (nums[j] <= nums[i]) { break }
  }
  j--
  let swap = nums[i]; nums[i] = nums[j]; nums[j] = swap
  nums.slice(i + 1).sort((b, a) => Number(b) - Number(a)).forEach((item, index) => {
    nums[index + i + 1] = item
  })
};