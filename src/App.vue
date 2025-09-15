<template>
  <!-- 全局布局容器 -->
  <AppLayout>
    <!-- 路由出口：所有页面都会渲染到这里 -->
    <router-view />
  </AppLayout>

  <!-- 返回顶部按钮（全局显示） -->
  <BackToTop />
</template>

<script setup>
import { onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BackToTop from '@/components/ui/BackToTop.vue'
import { useDataStore } from '@/stores/useDataStore'

// 初始化数据：页面加载时加载所有本地数据
onMounted(() => {
  const dataStore = useDataStore()
  dataStore.loadAllData()
})
</script>

<!-- src/App.vue -->
<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 浅色模式：默认背景 */
html,
body {
  background-color: #ffffff; /* 浅色背景 */
  color: #333333; /* 浅色文本 */
}

/* 深色模式：全局背景变黑 */
.dark html,
.dark body {
  background-color: #121212; /* 深色背景（覆盖浏览器默认） */
  color: #ffffff; /* 深色文本 */
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}
</style>
