// https://leetcode.cn/problems/sudoku-solver/description/

// 题解：行列方格数字可填状态哈希记录，DFS+回溯

/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {
  let row = new Array(9).fill(null).map(() => new Array(9).fill(false))
  let column = new Array(9).fill(null).map(() => new Array(9).fill(false))
  let rect = new Array(9).fill(null).map(() => new Array(9).fill(false))
  let empty = []
  const init = function () {
    board.forEach((item, x) => {
      item.forEach((each, y) => {
        if (each === '.') {
          empty.push([x, y])
          return
        }
        const num = Number(each) - 1
        row[x][num] = true
        column[y][num] = true
        rect[Math.floor(x / 3) * 3 + Math.floor(y / 3)][num] = true
      })
    })
  }

  const dfs = function (index) {
    if (index === empty.length) {
      return true
    }
    let [i, j] = empty[index]
    let reIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3)
    for (let k = 0; k < 9; k++) {
      if (row[i][k] || column[j][k] || rect[reIndex][k]) { continue }
      row[i][k] = true
      column[j][k] = true
      rect[reIndex][k] = true
      board[i][j] = String(k + 1)
      if (dfs(index + 1)) { return true }
      row[i][k] = false
      column[j][k] = false
      rect[reIndex][k] = false
      board[i][j] = '.'
    }
    return false
  }
  init()
  dfs(0)
  return board
};