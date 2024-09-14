// https://leetcode.cn/problems/valid-sudoku/description/

// 题解：直接模拟，哈希判断重复

/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
  const getColumArr = function (index) {
    return board[index].filter(item => item !== '.')
  }
  const getRowArr = function (index) {
    return board.map(item => item[index]).filter(item => item !== '.')
  }
  const getRecArr = function (index) {
    x = index % 3 * 3
    y = Math.floor(index / 3) * 3
    return [].concat(...board.slice(y, y + 3).map(item => item.slice(x, x + 3))).filter(item => item !== '.')
  }
  const isValid = function (arr) {
    const map = {}
    for (let index = 0; index < arr.length; index++) {
      if (map[arr[index]]) { return false }
      map[arr[index]] = true
    }
    return true
  }
  for (let i = 0; i < 9; i++) {
    if (!isValid(getColumArr(i)) || !isValid(getRowArr(i)) || !isValid(getRecArr(i))) {
      return false
    }
  }
  return true
};