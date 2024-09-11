# JS生成器

- [JS生成器](#js生成器)
  - [1、定义](#1定义)
  - [2、示例](#2示例)
  - [3、用处](#3用处)
  - [4、优点](#4优点)
  - [5、缺点](#5缺点)
  - [6、改进方法](#6改进方法)
  - [7、相关扩展知识](#7相关扩展知识)
    - [1）生成器简化异步编程](#1生成器简化异步编程)
    - [2）异步生成器](#2异步生成器)

## 1、定义

JavaScript 中的生成器是一种特殊类型的函数，它可以通过 **function*** 关键字定义，用于在迭代过程中产生一系列值。生成器函数可以通过 **yield** 关键字来暂停执行并返回一个值，然后在需要时调用**next()**继续执行，直到生成器函数结束或者手动中止。生成器函数可以用于**异步编程**、**处理大量数据**、**实现惰性计算**等场景。
&nbsp;

## 2、示例

```JavaScript
function* myGenerator (val0 = null) {
    let val = val0
    console.log('val =', val) // val = o
    val = yield 1;
    console.log('val =', val) // val = b
    val = yield 2;
    console.log('val =', val) // val = c
    val = yield 3;
    console.log('val =', val) // val = d
}

const gen = myGenerator('o')
console.log('yield get ', gen.next('a').value) // yield get 1
console.log('yield get ', gen.next('b').value) // yield get 2
console.log('yield get ', gen.next('c').value) // yield get 3
console.log('yield get ', gen.next('d').value) // yield get undefined
```

- myGenerator是一个生成函数，调用时返回了一个生成器对象gen，并在调用时进行了一次初始传参
- 生成器对象在首次next(...)时，传参无效，因为函数刚开始执行无断点接收传参
- 调用next(...)会在yield停止，并返回一个对象含有两个属性value和done，value为yield返回的值，done表明是否已执行完整个方法
- 再次调用next(...)时，会从上一断点继续执行，并把next传的参数带入
&nbsp;

## 3、用处

可以用来解决一些问题：

1. **简化异步编程**：生成器函数可以用于编写更加清晰、简洁的异步代码，避免回调地狱的问题（）。
2. **实现惰性计算**：生成器函数可以用于处理大量数据或者无限序列，只在需要时才生成新的值，从而节省内存和计算资源。
3. **实现协程和迭代器**：生成器函数可以用于实现协程和迭代器，提供了一种简单、可控的并发编程模型。
&nbsp;

## 4、优点

1. **简洁易读**：生成器函数可以将异步逻辑或者复杂的迭代过程表达得更加清晰、简洁。
2. **惰性求值**：生成器函数可以实现惰性计算，只在需要时才生成值，节省了资源。
&nbsp;

## 5、缺点

1. **无法中途停止**：生成器函数一旦开始执行，就无法中途停止，必须等到生成器函数结束或者返回结果后才能停止。
2. **不支持并发**：生成器函数是单线程执行的，不支持并发执行，可能会影响性能。
&nbsp;

## 6、改进方法

1. **异步生成器**：结合生成器函数和异步编程，可以实现在生成器函数中进行异步操作，并在每次 yield 时返回一个 Promise，以实现非阻塞的并发执行。
2. **协程**：使用生成器函数实现协程模型，可以在生成器函数中手动控制执行的暂停和恢复，以实现更灵活的并发编程模型（协程通过暂停和恢复模拟并发执行）。
3. **使用生成器库**：使用第三方的生成器库，如 co、bluebird 等，可以简化生成器函数的使用，并提供更多的功能和性能优化。
&nbsp;

## 7、相关扩展知识

### 1）生成器简化异步编程

当多个异步操作，依次依赖于前一操作时，容易产生回调地狱。此时可用生成器进行优化，每次yield返回一个Promise，执行结束后将结果作为next的传参继续执行生成器函数

```JavaScript
// 模拟异步操作的函数
function asyncTask (value) {
    return new Promise(resolve => {
        setTimeout(() => {
           console.log(`Task ${value} done`) 
           resolve(value)
        }, Math.random() * 1000);
    })
}

// 生成器，依次执行异步操作并返回结果
function* taskGenerator () {
    const result1 = yield asyncTask(1)
    const result2 = yield asyncTask(2)
    const result3 = yield asyncTask(3)
    return [result1, result2, result3]
}

// 执行生成函数
function runTask () {
    const gen = taskGenerator()
    // 处理异步操作结果，并传递给下一异步操作
    function handleTaskResult (result) {
        const { value, done } = gen.next(result)
        if (done) {
            console.log('All tasks done:', value)
        } else {
            value.then(handleTaskResult)
        }
    }
    // 开始执行
    handleTaskResult()
}
runTask()
```

上述代码也是协程的一个例子，**协程是一种并发编程模型，允许在异步操作之间保存状态，并在需要时恢复执行**。协程通过生成器函数和yield实现，与线程不同在于，协程不是并行执行的，是通过暂停和回复来模拟并行的。

&nbsp;

### 2）异步生成器

结合异步编程和生成器，再每次yield时返回一个Promise对象，再通过迭代器的方法`for await ... of ...`遍历循环获取生成器返回的Promise执行结果，即可实现类似Promise.all(...)的非阻塞并发执行

```JavaScript
const words = ['Hello', 'world', '.']
// 模拟异步操作的函数
function asyncTask (value) {
    return new Promise(resolve => {
        const time = Math.floor(Math.random() * 5000)
        setTimeout(() => {
            console.log(`Task ${value} done, get '${words[value]}', time: ${time}`)
            resolve(words[value])
        }, time)
    })
}

// 生成器
async function* taskGenerator () {
    const promiseArr = [asyncTask(0), asyncTask(1), asyncTask(2)] // 异步执行
    for (const promiseItem of promiseArr) {
        yield promiseItem // 按任务顺序迭代接收执行结果
    }
}

// 执行
async function runTask () {
    console.log('start time', new Date().getTime() % 100000)
    const gen = taskGenerator()
    const results = []
    for await (const promiseItem of gen) {
        results.push(await promiseItem)
    }
    console.log('All tasks done:', results)
    console.log('end time', new Date().getTime() % 100000)
}
runTask()
```
