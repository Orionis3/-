<template>
  <div class="home-container">
    <!-- 顶部个人信息和旋转菜单 -->
    <div class="home-header">
      <AvatarCard :profile="profile" />
      <RotateMenu />
    </div>

    <!-- 最新文章区域 -->
    <div class="latest-articles">
      <h2>
        <el-icon><EditPen /></el-icon>
        最新技术分享
      </h2>
      <div class="article-list">
        <ArticleCard v-for="article in latestArticles" :key="article.id" :article="article" />
      </div>
      <el-button type="text" class="view-more" @click="$router.push('/blog')">
        查看全部 <el-icon><Right /></el-icon>
      </el-button>
    </div>

    <!-- 旅行和书籍快速入口 -->
    <div class="quick-links">
      <el-card class="link-card" @click="$router.push('/travel')">
        <div class="link-content">
          <el-icon><MapLocation /></el-icon>
          <div>
            <h3>旅行日记</h3>
            <p>{{ travels.length }}篇游记 · 记录沿途风景</p>
          </div>
        </div>
      </el-card>

      <el-card class="link-card" @click="$router.push('/books')">
        <div class="link-content">
          <el-icon><Book /></el-icon>
          <div>
            <h3>读书清单</h3>
            <p>{{ books.length }}本书 · 阅读心得分享</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import AvatarCard from '@/components/ui/AvatarCard.vue'
import RotateMenu from '@/components/ui/RotateMenu.vue'
import ArticleCard from '@/components/ui/ArticleCard.vue'
import { EditPen, Right, MapLocation, Book } from '@element-plus/icons-vue'

// 获取数据
const dataStore = useDataStore()
const profile = computed(() => dataStore.profile)
const articles = computed(() => dataStore.articles)
const travels = computed(() => dataStore.travels)
const books = computed(() => dataStore.books)

// 取最新3篇文章
const latestArticles = computed(() => {
  // 按日期排序（新的在前）
  return [...articles.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.home-header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.latest-articles {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.view-more {
  align-self: flex-end;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.link-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.link-card:hover {
  transform: translateY(-5px);
}

.link-content {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.link-content el-icon {
  font-size: 28px;
  color: var(--el-color-primary);
}
</style>
