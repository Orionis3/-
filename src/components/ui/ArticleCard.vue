<template>
  <el-card class="article-card" hoverable>
    <div class="article-header">
      <h3 class="article-title title" :title="article.title">
        <router-link :to="`/article/${article.id}`" class="title-link">
          {{ article.title }}
        </router-link>
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
import { defineProps } from 'vue' // 引入defineProps

const props = defineProps({
  article: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 使用props消除未使用警告
console.log(props.article) // 实际项目中可删除，仅用于消除警告
</script>

<style scoped>
/* 保持原有样式不变 */
.article-card {
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.article-header {
  margin-bottom: 12px;
}

.article-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title-link {
  color: var(--el-text-color-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.title-link:hover {
  color: var(--el-color-primary);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.article-summary {
  flex: 1;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: 15px;
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
  padding-top: 10px;
}

/* 深色模式适配 */
:deep(.dark) .article-card {
  --el-card-bg-color: #1a1a1a;
}

:deep(.dark) .title-link {
  color: var(--el-text-color-primary);
}
</style>
