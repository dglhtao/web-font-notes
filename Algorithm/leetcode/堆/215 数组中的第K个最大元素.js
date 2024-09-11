// https://leetcode.cn/problems/kth-largest-element-in-an-array/description/

// 题解：堆排序，再取第K大的值

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
  // 构建堆方法一：自下而上（从底到顶遍历所有非叶子节点，不符合大根堆的向下递归调整，确保每个节点的子树都是一个大根堆）
  const setHeap1 = function (nums) {
    arr = JSON.parse(JSON.stringify(nums))
    const adjustHeap = function (i) {
      let left = i * 2 + 1
      let right = i * 2 + 2
      let maxI = i
      if (left < arr.length && arr[left] > arr[maxI]) { maxI = left }
      if (right < arr.length && arr[right] > arr[maxI]) { maxI = right }
      if (maxI !== i) {
        let swap = arr[maxI]; arr[maxI] = arr[i]; arr[i] = swap
        adjustHeap(maxI)
      }
    }
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      adjustHeap(i)
    }
    return arr
  }

  // 构建堆方法二：自上而下（依次将队列元素加入堆末尾，然后向上调整，子树是一个大根堆，父树在子树节点加入前也是个大根堆，则只需比较子节点和父节点是否需要交换，则可修复堆）
  const setHeap2 = function (nums) {
    const arr = []
    const adjustHeap = function (i) {
      const fatherI = Math.floor((i - 1) / 2)
      if (fatherI === i) { return }
      if (arr[fatherI] < arr[i]) {
        let swap = arr[fatherI]; arr[fatherI] = arr[i]; arr[i] = swap
        adjustHeap(fatherI)
      }
    }
    nums.forEach((item, i) => {
      arr.push(item)
      adjustHeap(i)
    })
    return arr
  }
  // console.log(setHeap1(nums))
  // console.log(setHeap2(nums))

  // 堆排序：大根堆中，每次把根和最后一个节点交换位置，然后堆容量-1，修复堆
  // k 为题中排序终止点
  const heapSort = function (nums, k = nums.length) {
    const arr = JSON.parse(JSON.stringify(nums))
    const adjustHeap = function (i, len) {
      left = i * 2 + 1
      right = i * 2 + 2
      let maxI = i
      if (left < len && arr[left] > arr[maxI]) { maxI = left }
      if (right < len && arr[right] > arr[maxI]) { maxI = right }
      if (maxI !== i) {
        let swap = arr[maxI]; arr[maxI] = arr[i]; arr[i] = swap
        adjustHeap(maxI, len)
      }
    }
    for (let i = 0; i < k; i++) {
      const index = nums.length - i - 1
      let swap = arr[0]; arr[0] = arr[index]; arr[index] = swap
      adjustHeap(0, index)
    }
    return arr
  }

  return heapSort(setHeap1(nums), k)[nums.length - k]
};