## BFC

[toc]

#### 是什么
块级格式上下文（Block Formating Context），W3C规范中的一个概念，决定了元素如何与兄弟元素、父元素进行布局交互。BFC是一个独立渲染区域或一个独立容器，内部子元素不影响外面元素，外面也不影响内部。

#### 特性和原则
1. 是一个块级元素，在垂直方向排列
2. BFC不会和内部元素发生边距重叠，但内部元素之间会发生margin重叠
3. BFC不会与float盒子重叠，可用于清除浮动，计算盒子高度时会考虑浮动元素

#### 功能
1. 防止元素垂直边距重叠
2. 清除浮动，防止高度塌陷
3. 阻止元素被其他浮动元素覆盖 

#### 如何触发BFC
1. 元素overflow设置成除visible外的值（hidden、scroll、auto）
2. 设置元素float为left或right
3. 设置元素position为absolute或fixed
4. 设置元素display为flow-root(专门用来创建BFC)、inline-block、table-cell、table-caption、flex或inline-flex

#### BFC为什么重要
1. BFC提供了一种方式控制元素和兄弟元素、父元素之间的布局交互，可以简化布局逻辑，提高代码的可维护性和可读性。
2. 方便了处理浮动元素、边距重叠、布局隔离等场景。
