# ES6中的Symbol数据类型

* [ES6中的Symbol数据类型](#es6中的symbol数据类型)
  * [1、是什么](#1是什么)
  * [2、如何使用](#2如何使用)
  * [3、解决了什么问题](#3解决了什么问题)
  * [4、优点](#4优点)
  * [5、缺点](#5缺点)
  * [6、如何改进缺点](#6如何改进缺点)
  * [7、扩展](#7扩展)
    * [1）内置Symbol](#1内置symbol)

## 1、是什么

Symbol是ES6新增的一种原始数据类型，用于表示独一无二的值。
&nbsp;

## 2、如何使用

Symbol是通过`Symbol()`函数创建的，每次调用`Symbol()`函数都会返回一个独一无二的Symbol值。

```JavaScript
const uniqueKey = Symbol('任意描述')
const obj = {
  [uniqueKey]: '该属性的值'
}
console.log(obj[uniqueKey]) // 之后只能通过uniqueKey访问到对应的值
```

&nbsp;

## 3、解决了什么问题

解决了对象属性名冲突的问题，可以用作对象的属性名，以确保不会与其他属性对象冲突；同时也提供了一种更换的方式来定义对象的私有属性和方法。
&nbsp;

## 4、优点

1. **独一无二的值**：每个 Symbol 值都是独一无二的，即使创建了多个相同参数的 Symbol，它们也是不相等的。
2. **隐藏属性，用作私有对象属性名**：Symbol 可以作为对象的属性名，用于定义对象的私有属性和方法，不会被意外修改和访问。同时由于Symbol值是不可遍历的，因此不会被`for...in`循环和`Object.keys()`方法遍历到
3. **内置Symbol值**：ES6提供了一些内置Symbol值，如`Symbol.iterator`、`Symbol.species`登，用于实现各种内置行为
&nbsp;

## 5、缺点

1. **不可枚举**：Symbol定义的属性是不可枚举的，可能导致一些问题，如使用`JSON.stringif()`时，Symbol属性会被忽略
2. **不容易调试**：由于Symbol是独一无二的，所以很难通过Symbol值来确定对象的属性
&nbsp;

## 6、如何改进缺点

1. **用`Object.getOwnPropertySymbols(...)`解决对象的Symbol枚举**

  ```JavaScript
  let symbolKey = Symbol('key')
  let obj = {
    [symbolKey]: 'value'
  }
  let symbols = Object.getOwnPropertySymbols(obj)
  symbols.forEach(key => {
    console.log(obj[item]) // value
  })
  ```

&nbsp;

## 7、扩展

### 1）内置Symbol

内置Symbol不需要通过Symbol()函数创建，而是直接使用引擎提供的预定义Symbol值

- **Symbol.iterator**：用于定义一个对象的默认迭代器方法
- **Symbol.match**：用于指定对象是否匹配正则表达式
- **Symbol.species**：用于指定构造函数创建派生对象的构造函数
- **Symbol.toPrimitive**：用于将对象转换为基本值（数字、字符串、布尔）

```JavaScript
const obj = {
  [Symbol.iterator]: function* () {
    yield 1
    yield 2
    yield 3
  }
}
for (const value of obj) { // 因为Symbol.iterator，表明对象可迭代，所以可用for...of 循环迭代obj对象
  console.log(value) // 1 2 3
}
```

```JavaScript
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return 1
    }
    if (hint === 'boolean') {
      return true
    }
    if (hint === 'string') {
      return 'Treated as String'
    }
  }
}

console.log(obj * 2) // 2
console.log(!obj) // false
console.log(String(obj)) // Treated as String
```
