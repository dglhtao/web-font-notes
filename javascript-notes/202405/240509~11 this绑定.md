# this绑定

- [this绑定](#this绑定)
  - [1、默认绑定](#1默认绑定)
  - [2、隐式绑定](#2隐式绑定)
    - [隐式丢失](#隐式丢失)
  - [3、显式绑定](#3显式绑定)
    - [1）硬绑定（bind函数）](#1硬绑定bind函数)
    - [2）API调用上下文](#2api调用上下文)
  - [4、new绑定](#4new绑定)
  - [5、优先级](#5优先级)
    - [判断this优先级的顺序](#判断this优先级的顺序)
  - [6、绑定例外](#6绑定例外)
    - [1）被忽略的this](#1被忽略的this)
    - [2）间接引用](#2间接引用)
    - [3）软绑定](#3软绑定)
  - [7、this词法](#7this词法)
    - [1）传统的bind(...)方法](#1传统的bind方法)
    - [2）ES6的箭头函数和传统的that=this](#2es6的箭头函数和传统的thatthis)
  - [8、总结](#8总结)

参考《你不知道的JavaScript(上卷)》P82

## 1、默认绑定

独立函数调用，绑定为全局window
用了严格模式的，this会绑定到undefined

```JavaScript
function foo () {
  "ues strict"
  console.log(this)
}
foo();
```

&nbsp;

## 2、隐式绑定

看调用位置是否有上下文（是否被某个对象拥有或包含），只有最后一层会影响
函数的嵌套调用不属于被对象包含，不影响this

```JavaScript
function foo() { 
 console.log( this.a );
}
var obj2 = { 
 a: 42,
 foo: foo 
};
var obj1 = { 
 a: 2,
 obj2: obj2 
};
obj1.obj2.foo(); // 42
```

### 隐式丢失

被隐式绑定的函数丢失绑定对象，此时应用默认绑定
参数传递、赋值、引用都会造成隐式丢失

```JavaScript
function foo() { 
 console.log( this.a );
}
var obj = { 
 a: 2,
 foo: foo 
};
var bar = obj.foo; // 函数别名！
var a = "oops, global"; // a 是全局对象的属性
bar(); // "oops, global"
```

虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的
bar() 其实是一个不带任何修饰的函数调用，因此应用了默认绑定。

```JavaScript
function foo() { 
 console.log( this.a );
}
function doFoo(fn) {
 var a = 1; // 干扰项，函数的嵌套调用不属于对象包含，不改变this
 // fn 其实引用的是 foo
 fn(); // <-- 调用位置！
}
var obj = { 
 a: 2,
 foo: foo 
};
var a = "oops, global"; // a 是全局对象的属性
doFoo( obj.foo ); // "oops, global"
```

把函数传入语言内置函数和自己声明的函数，结果一样

```JavaScript
function foo() { 
 console.log( this.a );
}
var obj = { 
 a: 2,
 foo: foo 
};
var a = "oops, global"; // a 是全局对象的属性
setTimeout( obj.foo, 100 ); // "oops, global"
```

&nbsp;

## 3、显式绑定

隐式绑定中，需要将函数包含在一个对象内调用，才能将this隐式绑定在这个对象上。如果不想在对象内包含这个函数的引用，而又要在对象上强制调用函数，则可以用显示绑定，通过call(...)和apply(...)指定要绑定到this的对象

call(...)和apply(...)第一个参数通常为对象，如果传的是原始值（字符串、布尔、数字），则会自动转换为对象形式(new String(...) 或 new Object(...) 或 Object(...))，这个操作称为“装箱”

隐式绑定，在引用、赋值、传递时会造成绑定丢失问题，可以用显示绑定的变种“硬绑定”来解决

### 1）硬绑定（bind函数）

原理：执行目标函数前，创建一个包裹函数，其内部调用显示绑定过的目标函数。之后无论如何调用包裹函数，都不用担心目标函数的this丢失。ES5提供了内置方法实现该功能 Function.prototype.bind

```JavaScript
function foo () {
  console.log(this.a)
}
var a = 1
var obj = { 
  a: 2,
  foo
}
obj.foo() // 2
setTimeout(obj.foo, 100) // 1 隐式绑定丢失
setTimeout('obj.foo()', 100) // 2
obj.foo.call(window) // 1 显示绑定到别的对象
obj.foo.call(obj) // 2
```

**硬绑定改造**：

```JavaScript
function foo () {
  console.log(this.a)
}
var a = 1
var obj = { a: 2 }
var myBind = function () {
  foo.call(obj)
}
myBind() // 2
setTimeout(myBind, 100) // 2
myBind.call(window) // 2 硬绑定后如何调用包裹函数都不会改动目标函数的this
```

**在外包裹一层函数可以增加参数透传功能**：

```JavaScript
function foo (something) {
  console.log(this.a, something)
}
var myBind = function () {
  return foo.apply(obj, arguments)
}
// 或
var myBind = function () {
  return foo.call(obj, ...arguments)
}
```

硬绑定解决了this丢失问题，但无法二次更改绑定对象
可以创建一个**辅助绑定函数（bind）**，只需在透传包裹函数外再包裹一个函数，指定**目标函数**和**this对象**即可

```JavaScript
var myBind = function (fn, obj) {
  return function () {
    return fn.apply(obj, arguments)
  }
}
```

ES5提供了Function.prototype.bind方法，用法如下：

```JavaScript
function foo(something) {
  console.log(this.a, something)
  return this.a + something
}
var a = 1
var obj = { a: 2 }
var bar = foo.bind(obj)
var b = bar(3) // 2 3
console.log(b) // 5
```

&nbsp;

### 2）API调用上下文

第三方库的许多函数，以及 JavaScript 语言和宿主环境中许多新的内置函数，都提供了一
个可选的参数，通常被称为“上下文”（context），其作用和 bind(..) 一样，确保你的回调
函数使用指定的 this。

```JavaScript
function foo(el) {
  console.log(el, this.id)
}
var id = 'interfere'
var obj = { id: 'result' }
[1, 2, 3].forEach(foo, obj) // 1 result 2 result 3 result
```

调用foo时时内置函数通过call(...)或apply(...)进行显示绑定，将上下文参数obj绑定为this

&nbsp;

## 4、new绑定

在传统的面向类的语言中，“构造函数”是类中的特殊方法，使用new初始化类时会调用类中的构造函数。

虽然在ES6中引入了class语法糖，但JavaScript本质还是基于原型的继承的，类的本质还是函数，而new的操作就是调用这些函数创建一个对象。

使用new来调用一个函数时会发生：

1. 创建（构造）一个全新的对象
2. 将新对象进行原型链接
3. 将新对象绑定到函数调用中的this
4. 如果函数没有返回其他对象（无返回或返回为基本数据类型），那么new表达式中的函数会自动返回这个新对象；如果返回的是个对象，则会抛弃原先创建的对象

```JavaScript
function foo(a) {
  this.a = a
}
function foo1(a) {
  this.a = a
  return 2
}
function foo2(a) {
  this.a = a
  return { b: a }
}
var bar = new foo(2)
var bar1 = new foo1(2)
var bar2 = new foo2(2)
console.log(bar) // { a: 2 }
console.log(bar1) // { a: 2 }
console.log(bar2) // { b: 2 }
```

`bar.__proto__.constructor`和`bar1.__proto__.constructor`分别 `foo`和`foo1`
`bar2.__proto__.constructor`是`Object`

使用 new 来调用 foo(..) 时，我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this上。new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定
&nbsp;

## 5、优先级

**this绑定一共有四条规则**：**默认绑定**、**隐式绑定**、**显示绑定**、**new绑定**

**默认绑定是优先级最低的**。

隐式绑定和显示绑定优先级的比较：

```JavaScript
function foo() {
  console.log(this.a)
}
var obj1 = {
  a: 1,
  foo
}
var obj2 = {
  a: 2,
  foo
}
obj1.foo() // 1
obj2.foo() // 2
obj1.foo.call(obj2) // 2
obj2.foo.call(obj1) // 1
```

**显示绑定比隐式绑定的优先级更高**。

隐式绑定和new绑定优先级的比较：

```JavaScript
function foo() {
  console.log(this.a)
}
var obj1 = {
  a: 1
  foo
}
var newObj = new obj1.foo()
console.log(newObj.a) // undefined
console.log(obj1.a) // 1
```

**new绑定比隐式绑定的优先级更高**。

new绑定和显示绑定优先级的比较：

```JavaScript
function foo(something) {
  this.a = something
}
var obj1 = {}
var bar = foo.bind(obj1)
bar(2)
console.log(obj1.a) // 2
var baz = new bar(3)
console.log(obj1.a) // 2
console.log(baz.a) // 3
```

**bind中存在方法用于判断是否被new调用，是的话则使用新创建的this替换硬绑定的this**。

由此可得this优先级：**new绑定 > 显示绑定 > 隐式绑定 > 默认绑定**

为什么要在new中使用硬绑定函数，而不直接使用简单的普通函数？
硬绑定bind(...)除了指定this外，还有一个功能，就是传参给下层参数。因此，如果要预设函数的一些参数时，就可能用到new中使用硬绑定函数。

该技术被称为“部分应用”，是“柯里化”的一种：

```JavaScript
function foo(p1, p2) {
  this.val = p1 + p2
}
var bar = foo.bind(null, 1)
// 因为在该场景中，new一个硬绑定函数化的构造函数，新this会取代原先硬绑定的this，所以bind的第一个参数传什么都无所谓，可直接传null
var baz = new bar(2)
baz.val // 3
```

### 判断this优先级的顺序

1. 函数是否在 new 中调用（new 绑定）？如果是的话this 绑定的是新创建的对象。
`var bar = new foo()`
2. 函数是否通过 call、apply（显式绑定）或者硬绑定调用？如果是的话，this 绑定的是指定的对象。
`var bar = foo.call(obj2)`
3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this 绑定的是那个上下文对象。
`var bar = obj1.foo()`
4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到全局对象。
`var bar = foo()`

&nbsp;

## 6、绑定例外

在某些场景下 this 的绑定行为会出乎意料，你认为应当应用其他绑定规则时，实际上应用的可能是默认绑定规则

### 1）被忽略的this

如果把null、undefined作为this的绑定对象传入显示绑定call、apply、bind，则会被忽略，实际使用的是默认绑定

```JavaScript
function foo () {
  console.log(this.a)
}
var a = 2
foo.call(null) // 2
```

传入null的情形（需要传入参数，但不关心this的时候）：
- 通过apply(...)来展开一个数组
- 通过bind(...)对参数进行柯里化（预设一些参数）

```JavaScript
function foo(a,b) {
  console.log(a, b)
}

foo.apply(null, [1, 2]) / 1 2

var bar = foo.bind(null, 1)
bar(2) // 1 2
```

在ES6中，可以用`...`代替`apply(...)`来“展开数组”
foo(...[1, 2]) 和 foo(1, 2) 是一样的

**更安全的this**：
在不关心this的时候，传入null占位是个不错的选择，但如果代码中有用到this，则可能污染全局环境下的变量，可以创建一个空对象，替代null称为占位符
创建一个空对象：`Object.create(null)`比`{}`和`new Object`更空，没有创建`Object.prototype`

### 2）间接引用

当创建一个函数的“间接引用”时，调用该函数会应用默认绑定。
赋值表达式：赋值后会返回所赋的值，如果不是一个基本类型（Number、Boolean、String、null、undefined，即除Object外的类型），则返回对该数据的引用

```JavaScript
function foo () {
  console.log(this.a)
}
var a = 2
var o = { a: 3, foo: foo }
var p = { a: 4 }
o.foo() // 3
(p.foo = o.foo)() // 2
p.foo() // 4
```

p.foo = o.foo 返回的是foo的引用，因此这里调用的是foo()，使用默认绑定

### 3）软绑定

硬绑定的Function.prototype.bind方法

```JavaScript
Function.prototype.myBind = function () {
  var fn = this // 原函数
  var obj = Array.prototype.shift.call(arguments) // 类数组转换，同时pop出第一个参数this
  var args = Array.prototype.slice.call(arguments) // 类数组转换
  var bound = function () {
    return fn.apply(
      this instanceof bound ? this : obj, // 判断this 是不是 bound 的一个实例，是的话说明被new调用，那this绑定在新实例上，否则沿用旧设定的this
      args.concat(Array.prototype.slice.call(arguments))  // 支持参数柯里化
    )
  }
  bound.prototype = Object.create(fn.prototype) // 继承原函数的原型
  bound.prototype.constructor = bound
  return bound
}
```

可以看出，通过硬绑定的方式把this强制绑定在指定对象时，除了new以外，都无法修改this绑定。无法再次使用隐式绑定或显示绑定来修改this，大大降低了灵活性。

如果我们给默认绑定指定一个全局对象和undefined以外的值，同时保留隐式绑定、显示绑定修改this的能力，就可以得出一种软绑定效果提高灵活性：

```JavaScript
Function.prototype.softBind = function () {
  var fn = this
  var obj = Array.prototype.shift.call(arguments, 1)
  var args = Array.prototype.slice.call(arguments)
  var bound = function () {
    return fn.apply(
      !this || [window, globalThis].includes(this) ? obj : this, // 有新this则用，无则用之前的绑定
      args.concat(Array.prototype.slice.call(arguments))
    )
  }
  bound.prototype = Object.create(fn.prototype)
  bound.prototype.constructor = bound
  return bound
}
```

验证代码：
```JavaScript
function foo (...something) {
    console.log(this.a, ...something)
    this.result = this.a + ' ' + something.join(' ')
}
var a = 1
var obj1 = {a: 2}
var obj2 = {a: 3}
var bar1 = foo.myBind(obj1, 4, '5')
var bar2 = foo.softBind(obj1, 4, '5')
bar1(6, '7') // 2 4 '5' 6 '7'
bar2(6, '7') // 2 4 '5' 6 '7'
bar1.call(obj2, 6, '7') // 2 4 '5' 6 '7' // 硬绑定非new不改this
bar2.call(obj2, 6, '7') // 3 4 '5' 6 '7' // 软绑定更改this
var bar3 = new bar1(6, '7')
bar3.result // undefined 4 '5' 6 '7' // 硬绑定new时，this绑定在实例下，实例无a所以undef
```

&nbsp;

## 7、this词法

### 1）传统的bind(...)方法

### 2）ES6的箭头函数和传统的that=this

ES6中新增了一种无法使用上述四种this规则的函数：箭头函数
箭头函数是根据外层作用域来决定this的

```JavaScript
function foo () {
  return (a) => { // this继承自 foo()
    console.log(this.a)
  }
}
var a = 0
var obj1 = { a: 1 }
var obj2 = { a: 2 }
var bar = foo.call(obj1) // 返回的箭头函数使用了foo()的this，foo()的this硬绑定为obj1，bar是对箭头函数的引用所以也使用foo的this绑定为obj1。箭头函数的绑定无法被修改，new 也不行
bar.call(obj2) // 1
```

箭头函数常用于回调函数中，如事件处理器、定时器。
箭头函数可以像`bind(...)`一样确保函数的this被绑定到指定对象，此外其重要性还体现在它用更常见的**词法作用域**取代了传统的**this机制**。
在ES6之前，就有一种几乎和箭头函数一样的模式：

```JavaScript
function foo() {
  var that = this
  setTimeout(function () {
    console.log(that.a)
  }, 100)
}
var obj = { a: 2 }
foo.call(obj) // 2
```

**箭头函数和`that=this`，看起来都可以取代`bind(...)`，从本质来说其实是替代this的机制，二者尽量不要混用，否则代码会更难编写和维护**。

&nbsp;

## 8、总结

如果要判断一个运行中函数的 this 绑定，就需要找到这个函数的直接调用位置。找到之后
就可以顺序应用下面这四条规则来判断 this 的绑定对象。

1. 由 new 调用？绑定到新创建的对象。
2. 由 call 或者 apply（或者 bind）调用？绑定到指定的对象。
3. 由上下文对象调用？绑定到那个上下文对象。
4. 默认：在严格模式下绑定到 undefined，否则绑定到全局对象。

一定要注意，有些调用可能在无意中使用默认绑定规则。如果想“更安全”地忽略 this 绑定，你可以使用一个 DMZ 对象，比如 ø = Object.create(null)，以保护全局对象。
ES6 中的箭头函数并不会使用四条标准的绑定规则，而是根据当前的词法作用域来决定this，具体来说，箭头函数会继承外层函数调用的 this 绑定（无论 this 绑定到什么）。这其实和 ES6 之前代码中的 that = this 机制一样。
