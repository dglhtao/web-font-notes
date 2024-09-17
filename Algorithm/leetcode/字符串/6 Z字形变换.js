// https://leetcode.cn/problems/zigzag-conversion/description/

// 题解：直接模拟

/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function(s, numRows) {
    if (numRows === 1) { return s }
    const arr = new Array(numRows).fill('')
    let index = 0, dir = 1
    Array.from(s).forEach(item => {
        arr[index] += item
        index += dir
        if (index >= numRows || index <= -1) { dir = -dir; index += 2 * dir }
    })
    return arr.join('')
};