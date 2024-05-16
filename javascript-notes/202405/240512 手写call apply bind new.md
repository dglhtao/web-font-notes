# 手写call、apply、bind、new

call、apply、bind都是Function.prototype自带的几个this绑定方法，为显示绑定；new，并返回一个实例对象，可在构造函数执行前传参。
原理：
，返回一个实例对象，实现this的new绑定

## 1、call(...)

call(...)方法给函数指定一个this值，并给出一个参数列表（一个或多个参数），用于调用一个函数。
`func.call(context, arg1, arg2, ...)`

原理：

1. 将call方法绑定在Function的原型上
2. 判断调用call的对象是否函数，不是则抛出错误
3. 判断是否传入了上下文参数context，无则绑定为全局（window 或 globalThis）；判断context是否基本数据类型，是则转换为Object
4. 用Symbol创建唯一键值，将函数通过键值绑定在上下文对象的新属性上
5. 将参数列表带入，调用函数，记录返回结果
6. 将刚绑定在上下文对象的新属性函数删除，复原上下文对象
7. 返回刚记录的函数执行结果

```JavaScript
Function.prototype.myCall = function (context, ...params) {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.myCall 被调用的对象必须是函数')
  }
  context = context || window
  !/^(object|function)$/.test(typeof context) ? context = new Object(context) : null
  const key = Symbol('key')
  context[key] = this
  const result = context[key](...params)
  delete context[key]
  return result
}
```

## 2、apply(...)

apply和call几乎一致，区别在于apply除给函数指定一个this值外，所传的其它参数，不是参数列表，而是一个参数数组。
`func.apply(context, argsArr)`

原理：

1. 将apply方法绑定在Function的原型上
2. 判断调用apply的对象是否函数，不是则抛出错误
3. 判断是否传入了上下文参数context，无则绑定为全局；判断context是否基本数据类型，是则转换为Object
4. 用Symbol创建唯一键值，将函数通过键值绑定在上下文对象的新属性上
5. 将参数数组带入，调用函数，记录返回结果
6. 将刚绑定在上下文对象的新属性函数删除，复原上下文对象
7. 返回刚记录的函数执行结果

```JavaScript
Function.prototype.myApply = function (context, argsArr) {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.myApply 调用对象必须为函数')
  }
  context = context || window
  !/^(object|function)$/.test(typeof context) ? null : context = Object(context)
  const key = Symbol('key')
  context[key] = this
  const result = context[key](...argsArr)
  delete context[key]
  return result
}
```

&nbsp;

## 3、bind(...)

与call和apply不同，bind再使用时并不会马上调用目标函数，而是返回一个更改了this后的目标函数（新建了一个函数继承原函数，同时写死this）。由于不会马上执行，bind可以实现柯里化（多次传参）。首个参数为this，剩余的参数为参数列表

``` JavaScript
const bound = func.bind(context, arg1, arg2, ...)
bound(arg3, arg4, ...)
```

原理：

1. 将bind方法绑定在Function的原型上
2. 判断调用bind的对象是否函数，不是则抛出错误，赋值目标函数，方便后续调用
3. 不必关心是否传入上下文参数context或context是否为基本数据类型，因为会透传给apply去处理，避免未传参数，所以用arguments代替形成
4. 新建一个包裹函数，返回对目标函数的调用，包裹用于透传参数，和指定调用绑定的上下文context
5. 包裹函数内，判断当前的this是否为该包裹函数的一个实例，是则说明当前为new操作，舍弃将要绑定的上下文context，this绑定在新实例(this)上；不是则继续绑定为指定的context
6. 包裹函数内，要将调用bind时传的参数列表，和包裹函数执行时的参数列表组合，传递给目标函数的调用
7. 包裹函数作为目标函数的衍生，需将包裹函数绑定进原型链中继承目标函数原型
8. 最后将包裹函数作为结果返回

```JavaScript
Function.prototype.myBind = function () {
  const fn = this
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.myBind 调用对象必须为函数')
  }
  const context = Array.prototype.shift.call(arguments)
  const args = Array.prototype.slice.call(arguments)
  const bound = function () {
    return fn.apply(
      this instanceof bound ? this : context,
      args.concat(Array.prototype.slice.call(arguments))
    )
  }
  bound.prototype = Object.create(fn.prototype)
  bound.prototype.constructor = bound
  return bound
}
```

还有另一种软绑定，基于硬绑定bind进行改造，包裹函数内的this为无或全局时，则使用旧的指定上下文，否则this有内容时，则使用新的上下文。

```JavaScript
const bound = function () {
  return fn.apply(
    !this || [window, globalThis].includes(this) ? context : this绑定在新实例,
    args.concat(Array.prototype.slice.call(arguments))
  )
}
```

## 4、new

new关键词的作用是执行一个构造函数，并返回一个实例对象，可在构造函数执行前传参。

```JavaScript
function Person (age) {
  this.name = 'Mike'
  this.age = age
}
const p = new Person(18)
console.log(p) // { name: 'Mike', age: 18 }
```

原理：

1. 传入一个构造函数对象和参数列表
2. 判断对象是函数，否则报错
3. 用构造函数原型实例化一个对象
4. 将该对象硬绑定为this，执行构造函数，并传入其它参数
5. 若构造函数无返回或返回的是基本数据类型，则返回刚创建的对象；若构造函数返回的是个对象类型（object和function），则将其作为结果返回

```JavaScript
function _new (constructor, ...args) {
  if (typeof constructor !== 'function') {
    throw new TypeError('constructor must be a function')
  }
  let obj = Object.create(constructor.prototype)
  const result = constructor.apply(obj, args)
  !/^(object|function)$/.test(typeof result) ? null : obj = result
  return obj
}
```

## 5、验证代码

### 1）call

```JavaScript
function Person (age) {
  console.log(this.name, age)
}
const obj = { name: 'Mike' }
var name = 'test'
Person(20) // test 20
Person.call(obj, 20) // Mike 20
Person.myCall(obj, 20) // Mike 20
```

### 2）apply

```JavaScript
function Person (age) {
  console.log(this.name, age)
}
const obj = { name: 'Mike' }
var name = 'test'
Person(20) // test 20
Person.apply(obj, [20]) // Mike 20
Person.myApply(obj, [20]) // Mike 20
```

### 3）bind

```JavaScript
function Person (age, address) {
  this.age = age
  this.address = address
  console.log(this.name, this.age, this.address)
}
var name = 'test'
const obj = { name: 'Mike' }
const bound1 = Person.bind(null, 18)
const bound2 = Person.bind(obj, 20)
bound1('guangzhou') // test 18 guangzhou
bound2('shenzhen') // Mike 20 shenzhen
const exp1 = new bound1('shanghai') // undefined 18 shanghai
const exp2 = new bound2('beijing') // undefined 20 beijing
console.log(exp1) // { age: 18, address: 'shanghai' }
console.log(exp2) // { age: 20, address: 'beijing' }

const bound3 = Person.myBind(null, 18)
const bound4 = Person.myBind(obj, 20)
bound3('guangzhou') // test 18 guangzhou
bound4('shenzhen') // Mike 20 shenzhen
const exp3 = new bound3('shanghai') // undefined 18 shanghai
const exp4 = new bound4('beijing') // undefined 20 beijing
console.log(exp3) // { age: 18, address: 'shanghai' }
console.log(exp4) // { age: 20, address: 'beijing' }
```

### 4）new

```JavaScript
function Person1 (age) {
  this.name = 'Mike'
  this.age = age
}
function Person2 (age) {
  this.name = 'Mike'
  this.age = age
  return age
}
function Person3 (age) {
  this.name = 'Mike'
  this.age = age
  return { age }
}
function Person4 (age) {
  this.name = 'Mike'
  this.age = age
  let that = this
  return function () {
    return that
  }
}
const p1 = new Person1(20)
const p2 = new Person2(20)
const p3 = new Person3(20)
const p4 = new Person4(20)
console.log(p1) // { name: 'Mike', age: 20 }
console.log(p2) // { name: 'Mike', age: 20 }
console.log(p3) // { age: 20 }
console.log(typeof p4, p4()) // function { name: 'Mike', age: 20 }

const np1 = _new(Person1, 20)
const np2 = _new(Person2, 20)
const np3 = _new(Person3, 20)
const np4 = _new(Person4, 20)
console.log(np1) // { name: 'Mike', age: 20 }
console.log(np2) // { name: 'Mike', age: 20 }
console.log(np3) // { age: 20 }
console.log(typeof np4, np4()) // function { name: 'Mike', age: 20 }
```
