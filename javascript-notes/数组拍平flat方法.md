## 数组拍平flat

问题：
1. 判断是数组
2. 控制拍平层数

#### 判断是数组
```JavaScript
Array.isArray([])
const isArray = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}
```

#### 代码
```JavaScript
const flat = function (arr, deep = -1) {
  if (!Array.isArray(arr) || deep === 0) { return arr }
  if (arr.findIndex(item => Array.isArray(item)) === -1) { return arr }
  return flat(Array.prototype.concat.apply([], arr), deep - 1)
}
```