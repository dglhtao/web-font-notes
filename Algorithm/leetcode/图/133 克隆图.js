// https://leetcode.cn/problems/clone-graph/description/
// 解法： 深拷贝

/**
 * // Definition for a _Node.
 * function _Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {_Node} node
 * @return {_Node}
 */
var cloneGraph = function(node) {
  const deepClone = function (data, map = new Map()) {
      if (data === undefined || data === null) { return data }
      if ([Function, RegExp, Set, Date].includes(Object.getPrototypeOf(data).constructor)) { return new (Object.getPrototypeOf(data).constructor)(data) }
      if (typeof data !== 'object') { return data }
      const target = Array.isArray(data) ? [] : {}
      if (map.has(data)) { return map.get(data) }
      map.set(data, target)
      for (const key in data) {
          target[key] = deepClone(data[key], map)
      }
      return target
  }
  return deepClone(node)
};