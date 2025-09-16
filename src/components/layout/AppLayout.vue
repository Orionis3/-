<template>
  <div class="app-layout">
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
  height: 900px;
  margin: 0 auto;
  padding: 20px;
}
/* 深色模式样式 */
:deep(.dark) .content {
  background-color: #1a1a1a;
  color: #fff;
}
</style>
