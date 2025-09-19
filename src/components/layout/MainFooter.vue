<template>
  <footer class="main-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-column">
          <h3 class="footer-title">分享技术与生活的个人博客</h3>
          <p class="footer-desc">记录前端开发技术、旅行见闻和读书心得，分享我的成长历程。</p>
        </div>

        <div class="footer-column">
          <h4>快速链接</h4>
          <ul class="footer-links">
            <li @click="$router.push('/')">首页</li>
            <li @click="$router.push('/blog')">技术分享</li>
            <li @click="$router.push('/travel')">旅行日记</li>
            <li @click="$router.push('/books')">书单</li>
            <li @click="$router.push('/about')">关于我</li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>搜索文章</h4>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章..."
            size="small"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button size="small" @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} 我的博客 | 保留所有权利</p>
        <p>使用 Vue3 + Element Plus + Pinia 构建</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchKeyword = ref('')

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { keyword: searchKeyword.value.trim() }
    })
  }
}
</script>

<style>
/* 页脚基础样式 */
.main-footer {
  padding: 40px 0 20px;
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-title {
  font-size: 18px;
  margin-bottom: 15px;
  color: var(--el-color-primary);
}

.footer-desc {
  margin-bottom: 20px;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
  cursor: pointer;
  transition: color 0.2s;
}

.footer-links li:hover {
  color: var(--el-color-primary);
}

.footer-bottom {
  padding-top: 20px;
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  border-top: 1px solid var(--border-color);
}

.footer-bottom p {
  margin-bottom: 8px;
}
</style>
