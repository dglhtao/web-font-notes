## [Leetcode]2028. 找出缺失的观测数据

现有一份 n + m 次投掷单个 六面 骰子的观测数据，骰子的每个面从 1 到 6 编号。观测数据中缺失了 n 份，你手上只拿到剩余 m 次投掷的数据。幸好你有之前计算过的这 n + m 次投掷数据的 平均值 。
给你一个长度为 m 的整数数组 rolls ，其中 rolls[i] 是第 i 次观测的值。同时给你两个整数 mean 和 n 。
返回一个长度为 n 的数组，包含所有缺失的观测数据，且满足这 n + m 次投掷的 平均值 是 mean 。如果存在多组符合要求的答案，只需要返回其中任意一组即可。如果不存在答案，返回一个空数组。
k 个数字的 平均值 为这些数字求和后再除以 k 。
注意 mean 是一个整数，所以 n + m 次投掷的总和需要被 n + m 整除。

作答：
```JavaScript
function getOrder (meanN) {
    let way = -1
    let num = Math.round(meanN)
    if (Math.round(meanN) === Math.floor(meanN)) {
        way = -1
    } else {
        way = 1
    }
    const arr = []
    for (let i = 0; i < 6; i++) {
        let num2 = num + i * way
        if (num2 < 1) {
            for (let j = num + 1; j <= 6; j++) { arr.push(j) }
            break
        }
        if (num2 > 6) {
            for (let j = num - 1; j >= 1; j--) { arr.push(j) }
            break
        }
        way *= -1
        num = num2
        arr.push(num)
    }
    return arr
}

function foo() {
    const n = arguments[0]
    const m = arguments[1]
    const mean = arguments[2]
    const mSet = Array.prototype.slice.call(arguments, 3)
    let meanAll = (n + m) * mean
    mSet.forEach(item => { meanAll -= item })

    // 最优尝试顺序
    const order = getOrder(meanAll / n)
    // 普通尝试顺序
    // const order = [6, 5, 4, 3, 2, 1]
    const orderNum = new Array(6).fill(0)

    function tryGet (index, meanAll, n) {
        if (meanAll === 0) { return true }
        if (index >= 6) { return false }
        for (let i = Math.min(Math.floor(meanAll / order[index]), n); i >= 0; i--) {
            const bool = tryGet(index + 1, meanAll - order[index] * i, n - i)
            if (bool) {
                orderNum[index] = i
                return true
            }
        }
        return false
    }

    if (tryGet(0, meanAll, n)) {
        const arr = []
        orderNum.forEach((item, index) => {
            arr.push(...new Array(item).fill(order[index]))
        })
        return arr
    } else {
        return []
    }
}
foo(3, 5, 4, 2, 3, 5, 6, 4) // [4, 4, 4]
foo(5, 3, 3, 2, 3, 5) // [3, 3, 3, 3, 2]
```

题解：
任意一组整数，最大最小值的差大于等于2，则可以用别的最大最小值不超过1的数将其替换，如：[1, 6] => [3, 4]，[1, 6, 6, 6] => [4, 5, 5, 5]
mean * (m + n) 求总数。
sum(rolls) 求已经有的数量。
sum = mean * (m+n) - sum(rolls) 剩下需要补充的平均分配就行。< N * 1 或者 > N * 6 则不可能有合法分配。

```JavaScript
function foo () {
    const n = arguments[0]
    const m = arguments[1]
    const mean = arguments[2]
    const mSet = Array.prototype.slice.call(arguments, 3)
    let meanAll = (n + m) * mean
    mSet.forEach(item => { meanAll -= item })
    if (meanAll > 6 * n || meanAll < 1 * n) {
      return []
    }
    const p = meanAll - Math.floor(meanAll / n) * n
    const arr = []
    arr.push(...new Array(p).fill(Math.floor(meanAll / n) + 1))
    arr.push(...new Array(n - p).fill(Math.floor(meanAll / n)))
    return arr
}
foo(3, 5, 4, 2, 3, 5, 6, 4) // [4, 4, 4]
foo(5, 3, 3, 2, 3, 5) // [3, 3, 3, 3, 2]
```
