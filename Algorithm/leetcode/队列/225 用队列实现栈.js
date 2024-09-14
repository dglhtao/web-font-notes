// https://leetcode.cn/problems/implement-stack-using-queues/description/

// 题解：直接模拟栈


var MyStack = function() {
  this.__stack = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
  this.__stack.push(x)
};

/**
 * @return {number}
 */
MyStack.prototype.pop = function() {
  return this.__stack.pop()
};

/**
 * @return {number}
 */
MyStack.prototype.top = function() {
  return this.__stack.length ? this.__stack[this.__stack.length - 1] : null
};

/**
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
  return !this.__stack.length
};

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = new MyStack()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */