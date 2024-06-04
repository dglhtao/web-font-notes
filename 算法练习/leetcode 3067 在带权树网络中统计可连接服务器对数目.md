## leetcode 3067 在带权树网络中统计可连接服务器对数目

### 题目

给你一棵无根带权树，树中总共有 n 个节点，分别表示 n 个服务器，服务器从 0 到 n - 1 编号。同时给你一个数组 edges ，其中 edges[i] = [ai, bi, weighti] 表示节点 ai 和 bi 之间有一条双向边，边的权值为 weighti 。再给你一个整数 signalSpeed 。
如果两个服务器 a ，b 和 c 满足以下条件，那么我们称服务器 a 和 b 是通过服务器 c 可连接的 ：
· a < b ，a != c 且 b != c 。
· 从 c 到 a 的距离是可以被 signalSpeed 整除的。
· 从 c 到 b 的距离是可以被 signalSpeed 整除的。
· 从 c 到 b 的路径与从 c 到 a 的路径没有任何公共边。
请你返回一个长度为 n 的整数数组 count ，其中 count[i] 表示通过服务器 i 可连接 的服务器对的 数目 。

### 作答

```JavaScript
function getCountArr (edges, signalSpeed) {
  const n = edges.length + 1
  const root = Math.floor(Math.random() * n)
  const nodeBool = new Array(n).fill(false)
  const nodeInfo = new Array(n).fill(null).map(() => ({}))
  nodeInfo[root].parent = undefined
  nodeBool[root] = true
  const dist = new Array(n).fill(null).map(() => new Array(n).fill(0))

  // 构造树
  function buildTree (node) {
    edges.forEach(edge => {
      const [x, y, len] = edge
      dist[x][y] = len
      dist[y][x] = len
      let sonNode
      if (x === node) { sonNode = y } else
      if (y === node) { sonNode = x } else
      { return }
      if (!nodeBool[sonNode]) {
        nodeBool[sonNode] = true
        nodeInfo[sonNode].parent = node
        nodeInfo[sonNode].len = len
        buildTree(sonNode)
      }
    })
  }
  buildTree(root)
  // console.log('nodeInfo', nodeInfo)

  // 获取所有点到root的路径
  const getAncestor = function (node) {
    if (nodeInfo[node].parent === undefined) { return [node] }
    return getAncestor(nodeInfo[node].parent).concat([node])
  }
  const ancestorNode = new Array(n).fill(null).map((item, index) => getAncestor(index))
  // console.log('ancestorNode', ancestorNode)

  // 获取任意两点的路径
  const getRoute = function (a, b) {
    const arr1 = ancestorNode[a]
    const arr2 = ancestorNode[b]
    let index = 0
    while (index < arr1.length && index < arr2.length && arr1[index] === arr2[index]) { index++ }
    index--
    const routeArr = arr1.slice(index).reverse().concat(arr2.slice(index + 1))
    return routeArr
  }

  // 根据最近公共祖先，获取任意两点间的距离
  function getNodeDist () {
    for (let a = 0; a < n - 1; a++) {
      for (let b = a + 1; b < n; b++) {
        const routeArr = getRoute(a, b)
        if (!dist[a][b]) {
          let len = 0
          for (let k = 1; k < routeArr.length; k++) {
            len += dist[routeArr[k - 1]][routeArr[k]]
            if (!dist[a][routeArr[k]]) { dist[a][routeArr[k]] = len }
            if (!dist[routeArr[k]][a]) { dist[routeArr[k]][a] = len }
          }
        }
      }
    }
  }
  getNodeDist()
  // console.log('dist', dist)
  
  const countArr = new Array(n).fill(0)
  function calcResult () {
    for (let a = 0; a < n - 1; a++) {
      for (let b = a + 1; b < n; b++) {
        const routeArr = getRoute(a, b)
        // 路径routeArr以a为起点，b为终点，c点只可能在中间任意一点中产生（因为ac、bc不能有公共边）
        for (let k = 1; k < routeArr.length - 1; k++) {
          const c = routeArr[k]
          if (dist[a][c] % signalSpeed === 0 && dist[b][c] % signalSpeed === 0) {
            countArr[c]++
          }
        }
      }
    }
  }
  calcResult()
  return countArr
}
```

测试数据：

```JavaScript
getCountArr([[0,1,1],[1,2,5],[2,3,13],[3,4,9],[4,5,2]], 1)
// [0, 4, 6, 6, 4, 0]

getCountArr([[0,6,3],[6,5,3],[0,3,1],[3,2,7],[3,1,6],[3,4,2]], 3)
// [2, 0, 0, 0, 0, 0, 2]
```