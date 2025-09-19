<template>
  <!-- 全局布局容器 -->
  <AppLayout>
    <!-- 路由出口：所有页面都会渲染到这里 -->
    <router-view />
  </AppLayout>
  <!-- 添加 Element Plus 回到顶部组件 -->
  <el-backtop :bottom="100">
    <div
      style="
        height: 100%;
        width: 100%;
        background-color: var(--el-bg-color-overlay);
        box-shadow: var(--el-box-shadow-lighter);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
        border-radius: 100%;
      "
    >
      ↑
    </div>
  </el-backtop>
</template>

<script setup>
import { onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDataStore } from '@/stores/useDataStore'
import { useAppStore } from '@/stores/useAppStore'

// 初始化数据和主题
onMounted(() => {
  // 加载所有本地数据
  const dataStore = useDataStore()
  dataStore.loadAllData()

  // 应用保存的主题设置
  const appStore = useAppStore()
  if (appStore.isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主题变量定义 */
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e5e7eb;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 深色模式变量 */
:root.dark {
  --bg-color: #121212;
  --text-color: #ffffff;
  --border-color: #374151;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 全局样式 */
html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 页脚样式 */
.main-footer {
  background-color: var(--bg-color) !important;
  border-top: 1px solid var(--border-color) !important;
  color: var(--text-color) !important;
  transition: all 0.3s ease;
}

.footer-desc,
.footer-links li,
.footer-bottom,
.footer-bottom p {
  color: var(--text-color) !important;
  opacity: 0.8;
}

/* 面包屑导航样式 */
.el-page-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-color);
}

.el-page-header__left .el-button {
  padding: 0;
  margin: 0;
}

/* 卡片通用样式 */
.article-card,
.link-card {
  transition: all 0.3s ease;
  box-shadow: var(--card-shadow);
}

.article-card:hover,
.link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: var(--el-color-primary-light);
}

.article-card:focus-within,
.link-card:focus-within {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
}
</style>
主要修复说明 深色模式页脚问题： 使用 CSS 变量统一管理主题颜色
移除MainFooter.vue的scoped属性，确保全局样式可穿透 为所有页脚元素添加基于主题变量的颜色定义
添加过渡动画使主题切换更自然 文章详情页导航： 使用el-page-header组件统一返回按钮样式
通过插槽整合面包屑导航，保持与旅行详情页一致 修复返回按钮功能，确保点击能正确返回上一页
卡片悬停效果： 为卡片添加统一的悬停动画 使用主题变量定义阴影效果，适配深色模式
确保卡片整体可点击，实现路由跳转 主题切换逻辑： 完善useAppStore中的深色模式切换功能
确保页面加载时正确应用保存的主题偏好 使用:root选择器提高样式优先级
这些修改保持了原有功能，同时解决了深色模式下的显示问题、导航一致性问题和卡片交互问题，所有样式修改都基于
CSS 变量实现，确保主题切换时的整体一致性。
