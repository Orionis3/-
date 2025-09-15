<template>
  <el-header class="main-header">
    <div class="container">
      <!-- 网站logo -->
      <div class="logo" @click="$router.push('/')" width="200px">
        <el-icon size="24"><Document /></el-icon>
        <span class="logo-text">我的博客</span>
      </div>

      <!-- 导航菜单 -->
      <el-menu mode="horizontal" :default-active="$route.name" class="nav-menu">
        <el-menu-item index="home" @click="$router.push('/')">
          <el-icon><Home /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="blog" @click="$router.push('/blog')">
          <el-icon><EditPen /></el-icon>
          <span>技术分享</span>
        </el-menu-item>
        <el-menu-item index="travel" @click="$router.push('/travel')">
          <el-icon><MapLocation /></el-icon>
          <span>旅行日记</span>
        </el-menu-item>
        <el-menu-item index="books" @click="$router.push('/books')">
          <el-icon><Book /></el-icon>
          <span>书单</span>
        </el-menu-item>
        <el-menu-item index="about" @click="$router.push('/about')">
          <el-icon><User /></el-icon>
          <span>关于我</span>
        </el-menu-item>
      </el-menu>

      <!-- 右侧功能区：搜索 + 深色模式 -->
      <div class="header-actions">
        <!-- 搜索框 -->
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文章..."
          class="search-input"
          size="small"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button icon="Search" size="small" @click="handleSearch" />
          </template>
        </el-input>

        <!-- 深色模式切换 -->
        <el-switch
          v-model="isDark"
          active-icon="Moon"
          inactive-icon="Sunny"
          @change="toggleDarkMode"
          class="dark-mode-switch"
        />
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
// 导入Element图标
import { Document, Home, EditPen, MapLocation, Book, User } from '@element-plus/icons-vue'

// 路由实例
// const route = useRoute()
const router = useRouter()

// 状态管理
const appStore = useAppStore()
const searchKeyword = ref('')
const isDark = ref(appStore.isDark)

// 初始化深色模式
onMounted(() => {
  appStore.initDarkMode()
  isDark.value = appStore.isDark
})

// 切换深色模式
const toggleDarkMode = () => {
  appStore.toggleDarkMode()
  isDark.value = appStore.isDark
}

// 处理搜索
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { keyword: searchKeyword.value.trim() }
    })
  }
}
</script>

<style scoped>
.main-header {
  display: flex;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  padding: 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
}
.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  font-weight: bold;
  font-size: 18px;
}
.nav-menu {
  flex: 1;
  margin: 0 20px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto; /* 左侧外边距自动填充，将右侧区域推到最右侧（Flex 布局关键技巧） */
}
.search-input {
  width: 200px;
}
.dark-mode-switch {
  --el-switch-on-color: #6b7280;
  --el-switch-off-color: #d1d5db;
}
</style>
