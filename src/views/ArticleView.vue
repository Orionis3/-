<template>
  <div class="article-detail">
    <el-skeleton v-if="loading" :loading="loading" class="article-skeleton">
      <template #template>
        <div style="height: 30px; margin-bottom: 10px"></div>
        <div style="height: 20px; margin-bottom: 20px"></div>
        <div style="height: 20px; width: 50%; margin-bottom: 10px"></div>
        <div style="height: 20px; margin-bottom: 10px"></div>
        <div style="height: 20px; margin-bottom: 10px"></div>
        <div style="height: 20px; width: 80%"></div>
      </template>
    </el-skeleton>

    <el-card v-else-if="article" class="article-card">
      <div class="article-header">
        <h1>{{ article.title }}</h1>
        <div class="meta-info">
          <span
            ><el-icon><Calendar /></el-icon> {{ article.date }}</span
          >
          <span
            ><el-icon><Tag /></el-icon>
            <el-tag v-for="tag in article.tags" :key="tag" size="small">
              {{ tag }}
            </el-tag>
          </span>
        </div>
      </div>

      <div class="article-content">
        <!-- 文章内容（使用v-html渲染Markdown转义后的HTML） -->
        <div v-html="renderedContent"></div>
      </div>

      <div class="article-actions">
        <el-button type="text" @click="$router.push('/blog')">
          <el-icon><ArrowLeft /></el-icon> 返回列表
        </el-button>
      </div>
    </el-card>

    <el-empty v-else description="未找到文章" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import { Calendar, Tag, ArrowLeft } from '@element-plus/icons-vue'

import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' // 代码高亮样式

// 路由参数
const route = useRoute()
const articleId = route.params.id

// 状态
const loading = ref(true)
const article = ref(null)

// 渲染后的内容
const renderedContent = computed(() => {
  if (!article.value) return ''
  // 配置marked支持代码高亮
  marked.setOptions({
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      }
      return hljs.highlightAuto(code).value
    },
    breaks: true,
    gfm: true
  })
  return marked.parse(article.value.content)
})

// 获取文章详情
onMounted(() => {
  const dataStore = useDataStore()
  article.value = dataStore.getArticleById(articleId)
  loading.value = false
})
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
}

.article-skeleton {
  padding: 20px;
}

.article-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--el-border-color);
}

.article-header h1 {
  margin-bottom: 15px;
  font-size: 24px;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  color: var(--el-text-color-secondary);
}

.meta-info el-icon {
  margin-right: 5px;
}

.article-content {
  line-height: 1.8;
  padding: 10px 0;
}

/* Markdown内容样式 */
.article-content h1,
.article-content h2,
.article-content h3 {
  margin: 1.5rem 0 1rem;
}

.article-content p {
  margin-bottom: 1rem;
}

.article-content pre {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.article-content code {
  font-family: monospace;
}

.article-content img {
  max-width: 100%;
  margin: 1rem auto;
  display: block;
}

.article-content ul,
.article-content ol {
  margin: 1rem 0 1rem 2rem;
}

.article-actions {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid var(--el-border-color);
}
</style>
