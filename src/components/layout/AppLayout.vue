<template>
  <div class="app-layout">
    <!-- 头部导航 -->
    <MainHeader />

    <!-- 主题切换按钮 -->
    <el-button :icon="ThemeIcon" circle size="small" class="theme-toggle" @click="toggleDarkMode" />

    <!-- 主内容区 -->
    <main class="main-content">
      <slot />
    </main>

    <!-- 页脚 -->
    <MainFooter />
  </div>
</template>

<script setup>
import MainHeader from './MainHeader.vue'
import MainFooter from './MainFooter.vue'
import { useAppStore } from '@/stores/useAppStore'
import { Moon, Sun } from '@element-plus/icons-vue'
import { computed } from 'vue'

const appStore = useAppStore()

// 切换深色模式
const toggleDarkMode = () => {
  appStore.toggleDarkMode()
}

// 动态切换图标
const ThemeIcon = computed(() => {
  return appStore.isDark ? Sun : Moon
})
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  background-color: var(--el-bg-color);
  border: 1px solid var(--border-color);
}
</style>
