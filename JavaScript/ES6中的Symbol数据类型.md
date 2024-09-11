# ES6中的Symbol数据类型

- [ES6中的Symbol数据类型](#es6中的symbol数据类型)
  - [1、是什么](#1是什么)
  - [2、如何使用](#2如何使用)
  - [3、解决了什么问题](#3解决了什么问题)
  - [4、优点](#4优点)
  - [5、缺点](#5缺点)
  - [6、如何改进缺点](#6如何改进缺点)
  - [7、扩展](#7扩展)
    - [1）Symbol常见属性和方法](#1symbol常见属性和方法)
      - [Symbol.length](#symbollength)
      - [Symbol.for()](#symbolfor)
      - [Symbol.keyFor()](#symbolkeyfor)
      - [Symbol.prototype.toString()](#symbolprototypetostring)
      - [Symbol.prototype.valueOf()](#symbolprototypevalueof)
      - [Symbol.iterator](#symboliterator)
      - [Symbol.hasInstance](#symbolhasinstance)
      - [Symbol.isConcatSpreadable](#symbolisconcatspreadable)
      - [Symbol.toPrimitive](#symboltoprimitive)
      - [Symbol.toStringTag](#symboltostringtag)
    - [1）内置Symbol](#1内置symbol)

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

### 1）Symbol常见属性和方法

#### Symbol.length

所有函数都有一个length属性，表明期望的参数（形参）个数。
Symbol.length为0，因为Symbol()没有任何必须参数

#### Symbol.for()

Symbol.for()方法会根据给定的字符串key，返回一个已经存在的symbol值。如果不存在，则会创建一个新的Symbol值并将其注册到全局Symbol注册表中。

```JavaScript
const symbol0 = Symbol('key') // 每次都创建一个新的唯一的Symbol，即使相同额描述也会创建不同的Symbol，未放在全局Symbol
const symbol1 = Symbol.for('key')
const symbol2 = Symbol.for('key')
console.log(symbol0 === symbol1) // false
console.log(symbol1 === symbol2) // true
```

#### Symbol.keyFor()

Symbol.keyFor()方法会返回一个已经存在的Symbol值的key。如果给定的Symbol值不存在于全局Symbol注册表中，则返回undefined。

```JavaScript
const symbol0 = Symbol('key')
const symbol1 = Symbol.for('key')
const symbol2 = Symbol.for('key')
console.log(Symbol.keyFor(symbol0)) // undefined
console.log(Symbol.keyFor(symbol1), Symbol.keyFor(symbol1) === Symbol.keyFor(symbol2)) // key true
```

#### Symbol.prototype.toString()

Symbol实例都有toString的方法，会返回Symbol的字符串表现形式，包含创建时的描述信息

#### Symbol.prototype.valueOf()

会返回Symbol值本身。大多数情况下都不需要显示调用valueOf。
原始类型（String、Number、Boolean）都有对应的对象包装器（String对象、Number对象、Boolean对象），被包装器包装成对象后，可以用valueOf()获取其原始值

```JavaScript
const sym1 = Symbol('desc')
const num1 = 1
const str1 = 'desc'
const bool1 = true

const symObj1 = Object(sym1)
const numObj1 = Object(num1) // new Number(num1)
const strObj1 = Object(str1) // new String(str1)
const boolObj1 = Object(bool1) // new Boolean(bool1)

console.log(typeof symObj1, typeof numObj1, typeof strObj1, typeof boolObj1) // object object object object
console.log(typeof sym1, typeof num1, typeof str1, typeof bool1) // symbol number string boolean
console.log(symObj1.valueOf(), numObj1.valueOf(), strObj1.valueOf(), boolObj1.valueOf()) // Symbol(desc) 1 'desc' true
console.log(sym1.valueOf(), num1.valueOf(), str1.valueOf(), bool1.valueOf()) // Symbol(desc) 1 'desc' true
```

#### Symbol.iterator

用于给对象定义一个默认迭代器方法，**有默认迭代器方法的对象才能用for...of调用迭代器**

```JavaScript
const obj = {
  a: 1, b: 2, c: 3
}
obj[Symbol.iterator] = function* () {
  for (const value of Object.keys(this)) { // Object.keys()自带[Symbol.iterator]，所以可以for...of
    yield this[value]
  }
}
for (const value of obj) { // 因为Symbol.iterator，表明对象可迭代，所以可用for...of 循环迭代obj对象
  console.log(value) // a b c
}
```

`for...in`获取对象下属性名，所以通常在Symbol.iterator迭代器方法中，写成获取对象下属性值，使得`for...of`可以获取对象属性值，当然也可以自由定义。

#### Symbol.hasInstance

挂载在构造函数对象或类对象下，用于改写对象的`instanceof`方法
默认的`a instanceof A`操作，用于判断某对象是否为另一对象的实例

```JavaScript
function Foo () {}
console.log([] instanceof Foo) // false
console.log((new Foo) instanceof Foo) // true

Object.defineProperty(Foo, Symbol.hasInstance, {
  value: function (obj) {
    return obj instanceof Array
  }
})
console.log([] instanceof Foo) // true
console.log((new Foo) instanceof Foo) // false
```

ES6语法糖class写法：

```JavaScript
class Foo {
  static [Symbol.hasInstance] (obj) {
    return obj instanceof Array
  }
}
console.log([] instanceof Foo) // true
console.log((new Foo) instanceof Foo) // false
```

#### Symbol.isConcatSpreadable

如果一个对象的Symbol.isConcatSpreadable属性为false，则在调用concat()方法时，该对象不会被展开。

```JavaScript
const arr = [1, 2]
const arr1 = [3, 4]
const obj1 = { 0: 3, 1: 4, length: 2, [Symbol.isConcatSpreadable]: true }
const obj2 = { 0: 3, 1: 4, length: 2, [Symbol.isConcatSpreadable]: false }
console.log(arr.concat(arr1)) // [1, 2, 3, 4]
console.log(arr.concat(obj1)) // [1, 2, 3, 4]
console.log(arr.concat(obj2)) // [1, 2, { 0: 3, 1: 4, length: 2, [Symbol.isConcatSpreadable]: false }]
```

#### Symbol.toPrimitive

挂载在对象下，当对象在执行强制类型转换时，会调用返回转换后的值。可以自定义强制类型转换时的行为

```JavaScript
const obj = {
  valueOf () { return 1 },
  [Symbol.toPrimitive] (hint) {
    if (hint === 'number') {
      return this.valueOf()
    } else
    if (hint === 'string') {
      return 'string'
    } else {
      return 'default'
    }
  }
}
console.log(1 - obj); // 0 减号将左右强制转换成number
console.log('123' - obj); // 122
console.log(obj - 1); // 0
console.log(obj - '1'); // 0
console.log(obj + 1); // default1 加号使用默认类型也可计算，所以用默认情况
console.log(`${obj}`); // 'string'
console.log(String(obj)); // 'string'
console.log(obj + '123'); // 'default123'
console.log('123' + obj); // '123default'
```


#### Symbol.toStringTag

对对象执行


### 1）内置Symbol

内置Symbol不需要通过Symbol()函数创建，而是直接使用引擎提供的预定义Symbol值

- **Symbol.match**：用于指定对象是否匹配正则表达式
- **Symbol.species**：用于指定构造函数创建派生对象的构造函数
- **Symbol.toPrimitive**：用于将对象转换为基本值（数字、字符串、布尔）



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
