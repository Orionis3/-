<template>
  <div class="blog-container">
    <el-page-header @back="handleBack" content="技术分享文章列表" />

    <!-- 标签筛选 -->
    <div class="tag-filter">
      <el-tag
        v-for="tag in allTags"
        :key="tag"
        :type="activeTag === tag ? 'primary' : ''"
        @click="handleTagClick(tag)"
        class="filter-tag"
      >
        {{ tag }}
      </el-tag>
    </div>

    <!-- 文章列表 -->
    <div class="article-grid">
      <ArticleCard v-for="article in filteredArticles" :key="article.id" :article="article" />
    </div>

    <!-- 空状态 -->
    <el-empty v-if="filteredArticles.length === 0" description="暂无相关文章" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import ArticleCard from '@/components/ui/ArticleCard.vue'

const router = useRouter()
const dataStore = useDataStore()

// 所有文章
const articles = computed(() => dataStore.articles)

// 标签筛选
const activeTag = ref('全部')
const allTags = computed(() => {
  // 收集所有标签并去重
  const tags = new Set(['全部'])
  articles.value.forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags)
})

// 筛选后的文章
const filteredArticles = computed(() => {
  if (activeTag.value === '全部') {
    return [...articles.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  return articles.value
    .filter((article) => article.tags.includes(activeTag.value))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

// 点击返回
const handleBack = () => {
  router.back()
}

// 点击标签筛选
const handleTagClick = (tag) => {
  activeTag.value = tag
}
</script>

<style scoped>
.blog-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color);
}

.filter-tag {
  cursor: pointer;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 10px;
}
</style>
