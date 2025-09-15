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

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 深色模式全局样式 */
.dark {
  --el-bg-color: #121212;
  --el-text-color-primary: #ffffff;
  --el-border-color: #333333;
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}
</style>
