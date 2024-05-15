# 手写call、apply、bind、new

call、apply、bind都是Function.prototype自带的几个this绑定方法，为显示绑定；new关键词的作用是执行一个构造函数，返回一个实例对象，实现this的new绑定

## 1、call(...)

call(...)方法给函数指定一个this值，并给出一个参数列表（一个或多个参数），用于调用一个函数。
`func.call(context, arg1, arg2, ...)`

原理：

1. 将call方法绑定在Function的原型上
2. 判断调用call的对象是否函数，不是则抛出错误
3. 判断是否传入了上下文参数context，无则绑定为全局；判断context是否基本数据类型，是则转换为Object
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
  let key = Symbol('key')
  context[key] = this
  let result = context[key](...params)
  delete context[key]
  return result
}
```

## apply(...)

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
Function.prototype.apply = function (context, argsArr) {
  if (typeof this !== 'function') {
    throw new TypeError('')
  }
}
```







和apply() 类似，区别在于call() 方法接受一个参数列表，apply() 方法接受一个包含多个参数的数组
手写参考：<https://www.jb51.net/javascript/284715v74.htm>

```JavaScript
function.call(thisArg, arg1, arg2, ...)
function.apply(thisArg, argsArray)
```

```JavaScript
Function.prototype.myCall = function (context, ...params) {
  context == null ? context = window : null
  !/^(object|function)$/.test(typeof context) ? context = Object(context) : null
  _this = this, result = null, key = Symbol('FUNC_KEY')
  context[key] = _this
  result = context[key](...params)
  delete context[key]
  return result
}
```

原理：context是数据对象，Function中的this是函数本身，往数据对象中添加一个函数，执行后删除函数，返回执行结果
注意：
1、判断context是否有传，未传则为window
2、判断context是不是引用数据类型，不是则转换为引用数据类型
3、保留this指向，创建Symbol key保证不冲突
4、把函数放到context中执行（改变了函数执行时的this指向），记录结果，删除函数
5、执行时通过context.key()执行，此时函数的this会指向context
&nbsp;

```JavaScript
Function.prototype.myApply = function (context, params = []) {
  context = context || window
  !/^(object|function)$/.test(typeof context) ? context = Object(context) : null
  _this = this, result = null, key = Symbol('func_key')
  context[key] = _this
  result = context[key](...params)
  delete context[key]
  return result
}
```

与 var 关键字不同，使用 let 在全局作用域中声明的变量不会成为 window 对象的属性（var 声明的则会）。
所以this为null时默认绑定时，var变量可被访问，let变量不可
