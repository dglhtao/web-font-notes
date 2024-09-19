// https://leetcode.cn/problems/implement-queue-using-stacks/description/

// 题解：用数组模拟栈的基本方法，再只使用栈的基本方法，实现队列

var MyQueue = function() {
  let stack = []
  this.pushToTop = function (item) {
      stack.push(item)
  }
  this.popFromTop = function () {
      return stack.pop()
  }
  this.getSize = function () {
      return stack.length
  }
  this.isEmpty = function () {
      return !stack.length
  }
};

/** 
* @param {number} x
* @return {void}
*/
MyQueue.prototype.push = function(x) {
  this.pushToTop(x)
};

/**
* @return {number}
*/
MyQueue.prototype.pop = function() {
  let list = new MyQueue()
  while (!this.isEmpty()) {
      list.pushToTop(this.popFromTop())
  }
  const result = list.popFromTop()
  while (!list.isEmpty()) {
      this.pushToTop(list.popFromTop())
  }
  return result
};

/**
* @return {number}
*/
MyQueue.prototype.peek = function() {
  let list = new MyQueue()
  while (!this.isEmpty()) {
      list.pushToTop(this.popFromTop())
  }
  const result = list.popFromTop()
  if (result !== undefined) {
      this.pushToTop(result)
  }
  while (!list.isEmpty()) {
      this.pushToTop(list.popFromTop())
  }
  return result
};

/**
* @return {boolean}
*/
MyQueue.prototype.empty = function() {
  return this.isEmpty()
};

/**
* Your MyQueue object will be instantiated and called as such:
* var obj = new MyQueue()
* obj.push(x)
* var param_2 = obj.pop()
* var param_3 = obj.peek()
* var param_4 = obj.empty()
*/