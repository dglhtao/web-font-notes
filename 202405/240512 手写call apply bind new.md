# 手写call、apply、bind、new

call、apply、bind、new都是Function.prototype自带的几个this绑定方法，前三者为显示绑定，最后一个为new绑定

## 1、call(...)

call(...)方法

call() 方法用于指定一个this值，和单独给出一个或多个参数来调用一个函数
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
