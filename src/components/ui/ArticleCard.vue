<template>
  <el-card class="article-card" hoverable @click="handleCardClick">
    <div class="article-header">
      <h3 class="article-title title" :title="article.title">
        {{ article.title }}
      </h3>
      <div class="article-meta">
        <el-icon size="14"><Calendar /></el-icon>
        <span>{{ article.date }}</span>
      </div>
    </div>

    <div class="article-summary">{{ article.summary }}</div>

    <div class="article-tags">
      <el-tag v-for="tag in article.tags" :key="tag" size="small" type="info" effect="light">
        {{ tag }}
      </el-tag>
    </div>
  </el-card>
</template>

<script setup>
import { Calendar } from '@element-plus/icons-vue'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  article: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 卡片点击事件 - 跳转到文章详情页
const handleCardClick = () => {
  router.push(`/articles/${props.article.id}`)
}
</script>

<style scoped>
.article-card {
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.article-card:hover::before {
  transform: scaleX(1);
}

.article-header {
  margin-bottom: 12px;
}

.article-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  line-height: 1.4;
  transition: color 0.3s;
}

.article-card:hover .article-title {
  color: #3b82f6;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.article-summary {
  flex: 1;
  color: var(--el-text-color-regular);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.article-tags .el-tag {
  transition: all 0.2s;
}

.article-card:hover .article-tags .el-tag {
  transform: translateY(-2px);
}
</style>
