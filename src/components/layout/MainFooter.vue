<template>
  <el-footer class="main-footer">
    <div class="container">
      <!-- 上部分内容 -->
      <div class="footer-content">
        <!-- 左侧：网站信息 -->
        <div class="footer-info">
          <div class="logo" @click="$router.push('/')">
            <el-icon size="24"><Document /></el-icon>
            <span class="logo-text">我的博客</span>
          </div>
          <p class="footer-desc">分享技术与生活的个人博客</p>
        </div>

        <!-- 中间：快速链接 -->
        <div class="footer-links">
          <h4>快速链接</h4>
          <ul>
            <li @click="$router.push('/')">首页</li>
            <li @click="$router.push('/blog')">技术分享</li>
            <li @click="$router.push('/travel')">旅行日记</li>
            <li @click="$router.push('/books')">书单</li>
            <li @click="$router.push('/about')">关于我</li>
          </ul>
        </div>

        <!-- 右侧：搜索框（与头部呼应） -->
        <div class="footer-search">
          <h4>搜索文章</h4>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章..."
            size="small"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button icon="Search" size="small" @click="handleSearch" />
            </template>
          </el-input>
        </div>
      </div>

      <!-- 下部分：版权信息 -->
      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} 我的博客 | 保留所有权利</p>
        <p class="footer-tech">使用 Vue3 + Element Plus + Pinia 构建</p>
      </div>
    </div>
  </el-footer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Document } from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

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
.main-footer {
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color);
  padding: 30px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 20px;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 15px;
}

.footer-desc {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.footer-links h4,
.footer-search h4 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
}

.footer-links ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links li {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.footer-links li:hover {
  color: var(--el-color-primary);
}

.footer-bottom {
  padding-top: 20px;
  border-top: 1px dashed var(--el-border-color);
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.footer-tech {
  margin-top: 5px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

/* 深色模式适配 */
:deep(.dark) .main-footer {
  background-color: #1a1a1a;
  border-top-color: #333;
}
</style>
