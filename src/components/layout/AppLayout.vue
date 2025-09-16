<template>
  <div class="app-layout">
    <!-- 添加星号动画容器 -->
    <div class="star-container"></div>
    <el-container>
      <el-header
        ><!-- 顶部导航栏 -->
        <MainHeader
      /></el-header>
      <el-main>
        <!-- 页面内容区 -->
        <main class="content">
          <slot />
          <!-- 插槽：用于插入具体页面内容 -->
        </main>
      </el-main>
      <el-footer
        ><!-- 页脚 -->
        <MainFooter
      /></el-footer>
    </el-container>
  </div>
</template>

<script setup>
import MainHeader from './MainHeader.vue'
import MainFooter from './MainFooter.vue'
import { onMounted, onUnmounted } from 'vue'

// 星号动画相关代码
let starContainer = null

// 创建随机颜色的星号
const createStar = (x, y) => {
  const star = document.createElement('span')
  star.textContent = '*'

  // 随机颜色
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff']
  star.style.color = colors[Math.floor(Math.random() * colors.length)]

  // 初始大小
  const size = 30
  star.style.fontSize = `${size}px`

  // 位置
  star.style.position = 'absolute'
  star.style.left = `${x}px`
  star.style.top = `${y}px`
  star.style.opacity = '1'

  // 添加到容器
  starContainer.appendChild(star)

  // 动画
  const duration = Math.random() * 2 + 1
  star.style.transition = `all ${duration}s ease`

  // 一段时间后开始下落并消失
  setTimeout(() => {
    star.style.transform = `translateY(200px)`
    star.style.fontSize = 0 // 大小变化
    star.style.opacity = '0'
    // 动画结束后移除元素
    setTimeout(() => {
      star.remove()
    }, duration * 1000)
  }, 1)
}

// 鼠标移动事件处理
const handleMouseMove = (e) => {
  // 每次鼠标移动创建一个星星
  setTimeout(() => {
    createStar(e.clientX, e.clientY)
  }, 10)
}

// 组件挂载时添加事件监听
onMounted(() => {
  starContainer = document.querySelector('.star-container')
  window.addEventListener('mousemove', handleMouseMove)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}
/* 深色模式样式 */
:deep(.dark) .content {
  background-color: #1a1a1a;
  color: #fff;
}
</style>
