const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  #status = PENDING
  #result = undefined
  #handlers = []

  #changeStatus (status, result) {
    if (this.#status === PENDING) {
      this.#status = status
      this.#result = result
      this.#run()
    }
  }

  #run () {
    if (this.#status === PENDING) { return }
    while (this.#handlers.length) {
      const { onFulfilled, onRejected, resolve, reject } = this.#handlers.shift()
      if (this.#status === FULFILLED) {
        this.#runOne(onFulfilled, resolve, reject)
      } else {
        this.#runOne(onRejected, resolve, reject)
      }
    }
  }

  #runOne (callback, resolve, reject) {
    this.#runMicroTask(() => {
      if (typeof callback !== 'function') {
        const settled = this.#status === FULFILLED ? resolve : reject
        settled(this.#result)
      } else {
        try {
          const data = callback(this.#result)
          if (this.#isPromiseLike(data)) {
            data.then(resolve, reject)
          } else {
            resolve(data)
          }
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  #runMicroTask (func) {
    if (typeof process === 'object' && typeof process.nextTick === 'function') {
      process.nextTick(func)
    } else
    if (typeof MutationObserver === 'function') {
      const ob = MutationObserver(func)
      const textNode = document.createTextNode('1')
      ob.observe(textNode, { characterData: true })
      textNode.data = '2'
    } else {
      setTimeout(func, 0) // 无微队列添加方法只能用宏队列代替
    }
  }

  #isPromiseLike (value) {
    return value !== null && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function'
  }

  constructor (executor) {
    const resolve = (result) => {
      this.#changeStatus(FULFILLED, result)
    }
    const reject = (result) => {
      this.#changeStatus(REJECTED, result)
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then (onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handlers.push({
        onFulfilled,
        onRejected,
        resolve,
        reject
      })
      this.#run()
    })
  }

  catch (onRejected) {
    return this.then(undefined, onRejected)
  }

  finally (onFinally) {
    return this.then(data => {
      onFinally()
      return data
    }, err => {
      onFinally()
      throw err
    })
  }

  static resolve (value) {
    if (value instanceof MyPromise) { return value }
    let _resolve, _reject
    const p = new MyPromise((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })
    if (p.#isPromiseLike(value)) {
      value.then(_resolve, _reject)
    } else {
      _resolve(value)
    }
    return p
  }

  static reject (value) {
    return new Promise((resolve, reject) => {
      reject(value)
    })
  }
}


// 测试数据

const p = new MyPromise((resolve, reject) => {
  console.log('inside')
  setTimeout(() => {
    setTimeout(() => {
      console.log('宏任务')
    }, 0)
    console.log('settimeout pre')
    resolve(123)
    console.log('settimeout before')
  }, 1000)
})

p.then(
  (res) => {
    console.log('success 1:', res)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(res * 2)
      }, 2000)
    })
  },
  (err) => {
    console.log('failure 1:', err)
  }
).then(data => {
  console.log('ok', data)
})

p.then(
  (res) => {
    console.log('success 2:', res)
  }
)
p.then(
  (res) => {
    console.log('success 3:', res)
  },
  (err) => {
    console.log('failure 3:', err)
  }
)
console.log('outside')
p.then(
  456,
  (err) => {
    console.log('failure 4:', err)
  }
).then(data => {
  console.log('ok', data)
})


// const p1 = new Promise((resolve) => {
//   resolve(1)
// })

// MyPromise.reject(p1).then((data) => {
//   console.log(data)
// }, (reason) => {
//   console.log('reason', reason)
// })