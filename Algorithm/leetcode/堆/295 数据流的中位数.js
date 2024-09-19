// https://leetcode.cn/problems/find-median-from-data-stream/description/

// 思路：首先想到一个堆，add添加元素，find将堆排序后获取中位数，结果超时
// 正解：构建两个堆，一个大根堆表示左半队列，一个小跟堆表示右半队列；
//       插入元素时先插入左半队列，再把最大值移到右半队列，若左长度小于右长度，则把右半队列的最小值移到左半队列；
//       每次获取中位数只需取堆顶元素


var MedianFinder = function() {
  this.lheap = []
  this.rheap = []
  swap = function (arr, a, b) {
      let swap = arr[a]; arr[a] = arr[b]; arr[b] = swap
  }
  fixLheap = (i, len) => {
      let left = i * 2 + 1
      let right = i * 2 + 2
      let maxI = i
      if (left < len && this.lheap[left] > this.lheap[maxI]) { maxI = left }
      if (right < len && this.lheap[right] > this.lheap[maxI]) { maxI = right }
      if (maxI !== i) {
          swap(this.lheap, maxI, i)
          fixLheap(maxI, len)
      }
  }
  fixRheap = (i, len) => {
      let left = i * 2 + 1
      let right = i * 2 + 2
      let minI = i
      if (left < len && this.rheap[left] < this.rheap[minI]) { minI = left }
      if (right < len && this.rheap[right] < this.rheap[minI]) { minI = right }
      if (minI !== i) {
          swap(this.rheap, minI, i)
          fixRheap(minI, len)
      }
  }
  this.addLheap = (num) => {
      this.lheap.push(num)
      let now = this.lheap.length - 1
      let fath = Math.floor((now - 1) / 2)
      while (now !== fath) {
          if (this.lheap[now] > this.lheap[fath]) {
              swap(this.lheap, now, fath)
              fath = Math.floor((fath - 1) / 2)
          }
          now = Math.floor((now - 1) / 2)
      }
  }
  this.addRheap = (num) => {
      this.rheap.push(num)
      let now = this.rheap.length - 1
      let fath = Math.floor((now - 1) / 2)
      while (now !== fath) {
          if (this.rheap[now] < this.rheap[fath]) {
              swap(this.rheap, now, fath)
              fath = Math.floor((fath - 1) / 2)
          }
          now = Math.floor((now - 1) / 2)
      }
  }
  this.popLheap = function () {
      swap(this.lheap, 0, this.lheap.length - 1)
      fixLheap(0, this.lheap.length - 1)
      return this.lheap.pop()
  }
  this.popRheap = function () {
      swap(this.rheap, 0, this.rheap.length - 1)
      fixRheap(0, this.rheap.length - 1)
      return this.rheap.pop()
  }
};

/** 
* @param {number} num
* @return {void}
*/
MedianFinder.prototype.addNum = function(num) {
  this.addLheap(num)
  this.addRheap(this.popLheap())
  if (this.lheap.length < this.rheap.length) {
      this.addLheap(this.popRheap())
  }
  // console.log(this.lheap, this.rheap)
};

/**
* @return {number}
*/
MedianFinder.prototype.findMedian = function() {
  if (this.lheap.length === this.rheap.length) {
      return (this.lheap[0] + this.rheap[0]) / 2
  } else {
      return this.lheap[0]
  }
};

/**
* Your MedianFinder object will be instantiated and called as such:
* var obj = new MedianFinder()
* obj.addNum(num)
* var param_2 = obj.findMedian()
*/