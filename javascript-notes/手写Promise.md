# 手写Promise

[toc]

## 基本用法
```JavaScript
const executor = (resolve, reject) => {}
const p = new Promise(executor)
p.then(onFulfilled, onRejected)
p.then(onFulfilled, onRejected).then(onFulfilled, onRejected)
```

## Promise简介
1. Promise是ES6新增的异步调用解决方案，解决异步函数的回调地狱问题
2. Promise只有三种状态pending、fulfilled、rejected，且只能由pending变化成fulfilled或rejected
3. 使用者提供执行函数executor和then方法的参数回调函数onFulfilled、onRejected，执行函数中的resolve、reject是Promise提供给使用者改变Promise状态的函数

## 思路
1. 基本结构：status、result、then方法
2. Promise在构建时，生成执行函数的参数resolve、reject方法，并自动调用执行函数
3. then方法：构建新的Promise并返回，构建时指定执行函数为：缓存该Promise数据handler: { onFulfilled, onRejected, resolve, reject }，包含原Promise的回调函数、当前Promise执行函数的参数
4. 在Promise调用链中，每个Promise首次调用resolve或reject时，该Promise状态发生变更，并根据该Promise下缓存的数据列表handlers，更新对应then方法所返回的新Promise的状态
5. handler: { onFulfilled, onRejected, resolve, reject }更新Promise状态原理是，根据原Promise变更后的状态，确定调用onFulfilled回调还是onRejected回调，调用任务需要放入**微队列**中排队，注意：
   1) 若回调不是函数，则沿用原Promise的result和status
   2) 将原Promise的result作为参数，执行回调函数，获取回调的返回结果，执行过程中有报错则reject错误，成功且结果不为Promise，则resolve结果
   3) **回调结果data是个Promise**，则用当前Promise的resolve和reject方法，当做data的回调，执行data.then(resolve, reject)，实现当前Promise的状态变更取决于data执行函数是否能正常执行
6. 判断一个数据value是否Promise，可通过Promise A+规范：`value !== null && (typeof value === 'object' || typeof value === 'function') && value.then === 'function'`
7. 微队列添加任务:
   node环境：`typeof process === 'object' && typeof process.nextTick === 'function'`，则`process.nextTick(func)`
   浏览器环境：用MutationObserver观察器，观察到节点变化时会自动将绑定的任务添加进微队列的机制。

代码详见：手写Promise.js