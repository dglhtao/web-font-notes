// https://leetcode.cn/problems/group-anagrams/

// 题解：哈希：1、关键字用字母排序方式；2、关键字用质数相乘取余的方式

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    let keyValue = {}
    const getKeyBefore = function () {
        const isPrime = function (num) {
            for (let j = 2; j <= Math.sqrt(num); j++) {
                if (num % j === 0) { return false }
            }
            return true
        }
        let num = 2
        for (let i = 0; i < 26; i++) {
            while (!isPrime(num)) {
                num++
            }
            keyValue[String.fromCharCode(97 + i)] = num
            num++
        }
    }
    getKeyBefore()
    const getKey = function (str) {
        // return Array.from(str).sort().join('')
        let key = 1
        Array.from(str).forEach(item => {
            key = key * keyValue[item]
            if (key > 1000000007) {
                key = key % 1000000007
            }
        })
        return key
    }
    const obj = {}
    strs.forEach(item => {
        const key = getKey(item)
        if (obj[key]) {
            obj[key].push(item)
        } else {
            obj[key] = [item]
        }
    })
    const arr = []
    for (let key in obj) {
        arr.push(obj[key])
    }
    return arr
};