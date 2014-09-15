# 简介

----

Tooltip 的简介

----

## 目录

  * 为什么创建此模块
  * 做了什么
  * 如何使用
  * 更多

### 为什么

  * 在图表中文本的提示信息主要由2种：一种是固定的文本，例如坐标轴上的坐标文本；另一种是交互性的文本，例如鼠标移动到饼图上显示当前饼图的信息等场景。
  * Tooltip主要解决动态的文本提示，并需要跟鼠标进行交互，当鼠标移动到对应坐标上做出对应的响应。
  * 在实际的项目中，文本需要一些个性化的调整，样式、内容等方面，所以需要很灵活的适应性。

### 做了什么

  * Tooltip 可以很方便的定位和移动
  * Tooltip 很简单的替换标题和内容
  * Tooltip 可以多个图形元素共同使用，有一条crosshairs(瞄准线)
  * Tooltip 可以很方便的切换成html，内容使用Html填充
  * Tooltip 可以很好的跟图表的可视区域（[Plot.Range](http://spmjs.io/docs/achart-plot/wiki/range.html))配合使用

### 如何使用

  * Tooltip 可以在图形标签（svg & vml)或者html之间切换
  * Tooltip 可以在坐标中中跟坐标轴配合使用

### 更多

  * [tooltip 详情](tooltip.md)