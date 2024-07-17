# function的arguments参数

* [function的arguments参数](#function的arguments参数)
  * [1、概念](#1概念)
  * [2、用法](#2用法)
  * [3、样例](#3样例)
  * [4、优点](#4优点)
  * [5、缺点](#5缺点)
  * [6、改进缺点](#6改进缺点)

## 1、概念

arguments 是一个**类数组**对象，它包含了函数调用时传递的所有参数。在函数内部，可以使用。
arguments 对象来访问所有传递给函数的参数，即使函数没有明确指定参数名称也可以访问到。
常用于中间函数的参数透传，或多种参数数量情况的函数。

**特征**：

1. arguments对象和Function是分不开的。
2. 因为arguments这个对象不能显式创建。
3. arguments对象只有函数开始时才可用。
&nbsp;

## 2、用法

在function () {} 内使用

- arguments[0] 当数组一样使用
- arguments.length 长度
- arguments.callee(...) 调用函数自身（递归）
&nbsp;

## 3、样例

```JavaScript
function sum (n) {
  if (n <= 1) { return n }
  else {
    return n + arguments.callee(n - 1)
  }
}
console.log(sum(6)) // 21
```

**注意agruments传递参数为函数时，this的指向问题：**

```JavaScript
var length = 10;
function fn() {
  console.log(this.length);
}
var obj = {
  method: function(fn) {
    fn();
    arguments[0]();
  },
  length: 5
};
obj.method(fn, 1);
```

fn参数为引用数据类型，调用时逐层溯源查看是否有上下文关系，无所以采用this的默认绑定，绑定为全局window
arguments[0]值为fn，由于arguments[0]挂在arguments下，存在上下文关系（对象包含关系），所以采用this的隐式绑定，绑定为arguments

输出：

```Output
10
2
```

&nbsp;

## 4、优点

1. **灵活性**：arguments 对象允许函数接受任意数量的参数，而不需要事先定义形参。即使为定义形参，也可通过arguments访问
2. **兼容性**：arguments 是 JavaScript 语言的内置特性，在所有支持 JavaScript 的环境中都可以使用。
&nbsp;

## 5、缺点

1. **不是真正的数组**：arguments 对象是类数组对象，不具备数组的所有方法和属性，导致在某些情况下需要将其转换为真正的数组。
2. **影响性能**：在使用 arguments 对象时，由于它是一个动态对象，可能会影响函数的性能。
3. **严格模式限制**：在严格模式（'use strict'）下，arguments 对象的行为有所限制，例如无法修改参数值。
&nbsp;

## 6、改进缺点

1. **使用剩余参数的写法**：ES6引入了剩余参数的语法`...args`，允许将所有传递给函数的参数收到一个真正的数组中，解决了arguments类数组的一些限制
