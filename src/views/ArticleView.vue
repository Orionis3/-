<template>
  <div class="article-detail-page">
    <!-- 面包屑导航 -->
    <div class="container breadcrumb-container">
      <el-breadcrumb separator="›">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/blog' }">技术文章</el-breadcrumb-item>
        <el-breadcrumb-item>{{ article?.title || '文章详情' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 主要内容区 -->
    <div class="container main-content">
      <div class="content-wrapper">
        <!-- 文章主体 -->
        <div class="article-main">
          <!-- 加载状态 -->
          <el-skeleton v-if="loading" :loading="loading" class="article-skeleton">
            <template #template>
              <div style="height: 40px; margin-bottom: 15px"></div>
              <div style="height: 24px; margin-bottom: 25px"></div>
              <div style="height: 20px; width: 100%; margin-bottom: 15px"></div>
              <div style="height: 20px; width: 100%; margin-bottom: 15px"></div>
              <div style="height: 20px; width: 80%; margin-bottom: 30px"></div>
              <div style="height: 280px; width: 100%; margin-bottom: 30px"></div>
              <div style="height: 20px; width: 100%; margin-bottom: 15px"></div>
            </template>
          </el-skeleton>

          <!-- 文章内容 -->
          <el-card v-else-if="article" class="article-card">
            <!-- 文章头部 -->
            <div class="article-header">
              <h1 class="article-title">{{ article.title }}</h1>

              <div class="article-meta">
                <div class="publish-info">
                  <span class="meta-item"
                    ><el-icon size="16"><Calendar /></el-icon> {{ formatDate(article.date) }}</span
                  >
                  <span class="meta-item"
                    ><el-icon size="16"><Eye /></el-icon> {{ article.views }} 阅读</span
                  >
                  <span class="meta-item"
                    ><el-icon size="16"><Message /></el-icon>
                    {{ article.comments?.length || 0 }} 评论</span
                  >
                </div>
              </div>

              <div class="article-tags">
                <el-tag
                  v-for="tag in article.tags"
                  :key="tag"
                  type="info"
                  effect="light"
                  @click="handleTagClick(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>

            <!-- 文章封面 -->
            <div class="article-cover" v-if="article.cover">
              <img :src="article.cover" :alt="article.title" class="cover-image" />
            </div>

            <!-- 文章内容 -->
            <div class="article-content">
              <div v-html="renderedContent" class="markdown-content"></div>

              <!-- 注意事项卡片 -->
              <el-card class="tips-card" v-if="article.notes">
                <template #header>
                  <div class="tips-header">
                    <el-icon><WarningFilled /></el-icon>
                    <span>注意事项</span>
                  </div>
                </template>
                <div class="tips-content">
                  <p>{{ article.notes }}</p>
                </div>
              </el-card>

              <!-- 代码示例 -->
              <div class="code-example" v-if="article.codeExample">
                <h3>示例代码</h3>
                <pre><code class="language-javascript">{{ article.codeExample }}</code></pre>
              </div>
            </div>

            <!-- 文章底部操作区 -->
            <div class="article-actions">
              <el-button type="text" class="action-btn" @click="handleLike">
                <el-icon :color="isLiked ? '#36d399' : ''"><ThumbUp /></el-icon>
                <span>{{ article.likes || 0 }} 有用</span>
              </el-button>
              <el-button type="text" class="action-btn" @click="handleShare">
                <el-icon><Share /></el-icon>
                <span>分享</span>
              </el-button>
              <el-button type="text" class="action-btn" @click="handleCopyLink">
                <el-icon><CopyDocument /></el-icon>
                <span>复制链接</span>
              </el-button>
            </div>
          </el-card>

          <el-empty v-else description="未找到文章" />

          <!-- 相关推荐 - 修复显示问题 -->
          <div class="related-articles" v-if="!loading">
            <h3 class="related-title">延伸阅读</h3>
            <!-- 当有相关文章时显示 -->
            <div class="related-list" v-if="relatedArticles.length > 0">
              <el-card
                v-for="(item, index) in relatedArticles"
                :key="item.id"
                class="related-card"
                @click="navigateToArticle(item.id)"
                :style="{ animationDelay: `${index * 100}ms` }"
              >
                <div class="related-item">
                  <h4 class="related-item-title">{{ item.title }}</h4>
                  <div class="related-item-meta">
                    <span>{{ formatDate(item.date) }}</span>
                    <span>{{ item.tags[0] || '技术' }}</span>
                  </div>
                </div>
              </el-card>
            </div>

            <!-- 当没有相关文章时显示 -->
            <div class="no-related" v-else>
              <p>暂无相关文章推荐</p>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="sidebar">
          <!-- 文章目录 -->
          <el-card class="sidebar-card" v-if="toc.length > 0">
            <template #header>
              <h3 class="sidebar-title">文章目录</h3>
            </template>
            <div class="toc-list">
              <div
                class="toc-item"
                v-for="(item, index) in toc"
                :key="index"
                :class="{ 'toc-item-h3': item.level === 3 }"
                @click="scrollToAnchor(item.id)"
              >
                {{ item.text }}
              </div>
            </div>
          </el-card>

          <!-- 技术分类 -->
          <el-card class="sidebar-card">
            <template #header>
              <h3 class="sidebar-title">技术分类</h3>
            </template>
            <div class="category-list">
              <div
                class="category-item"
                v-for="(category, index) in categories"
                :key="category.id"
                @click="handleCategorySearch(category.name)"
                :style="{ animationDelay: `${index * 100}ms` }"
              >
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">{{ category.count }}</span>
              </div>
            </div>
          </el-card>

          <!-- 热门资源 -->
          <el-card class="sidebar-card">
            <template #header>
              <h3 class="sidebar-title">热门文章</h3>
            </template>
            <div class="resource-list">
              <div
                class="resource-item"
                v-for="(article, index) in popularArticles"
                :key="article.id"
                @click="navigateToArticle(article.id)"
                :style="{ animationDelay: `${index * 100}ms` }"
              >
                <el-icon class="resource-icon"><Document /></el-icon>
                <span class="resource-name">{{ article.title }}</span>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import {
  Calendar,
  Eye,
  WarningFilled,
  ThumbUp,
  Share,
  CopyDocument,
  Message,
  Document
} from '@element-plus/icons-vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import { ElMessage } from 'element-plus'

// 配置marked
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true,
  headerIds: true,
  headerPrefix: 'heading-'
})

// 路由和状态管理
const route = useRoute()
const router = useRouter()
const dataStore = useDataStore()
const articleId = ref(route.params.id)

// 状态
const loading = ref(true)
const article = ref(null)
const isLiked = ref(false)
const toc = ref([])
const categories = ref([
  { id: 1, name: '前端开发', count: 128 },
  { id: 2, name: '后端开发', count: 96 },
  { id: 3, name: '移动开发', count: 74 },
  { id: 4, name: '人工智能', count: 62 },
  { id: 5, name: '云计算', count: 48 }
])
const popularArticles = ref([])
const relatedArticles = ref([])

// 监听路由变化，确保文章ID更新时重新加载
watch(
  () => route.params.id,
  (newId) => {
    if (newId && newId !== articleId.value) {
      articleId.value = newId
      loadArticleData()
    }
  },
  { immediate: true }
)

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

// 生成文章目录
watch(
  () => article.value?.content,
  (newContent) => {
    if (!newContent) {
      toc.value = []
      return
    }

    toc.value = []
    const tempLexer = new marked.Lexer()
    const tokens = tempLexer.lex(newContent)

    tokens.forEach((token, index) => {
      if (token.type === 'heading') {
        const id = `heading-${index + 1}`
        toc.value.push({
          id,
          text: token.text,
          level: token.depth
        })
      }
    })
  },
  { immediate: true }
)

// 渲染文章内容
const renderedContent = computed(() => {
  if (!article.value?.content) return '<p>文章内容加载中...</p>'
  return marked.parse(article.value.content)
})

// 处理点赞
const handleLike = () => {
  if (!article.value) return
  isLiked.value = !isLiked.value
  article.value.likes = isLiked.value
    ? (article.value.likes || 0) + 1
    : Math.max(0, (article.value.likes || 0) - 1)
  dataStore.updateArticleLikes(articleId.value, article.value.likes)
}

// 处理分享
const handleShare = () => {
  if (!article.value) return
  const url = window.location.href
  if (navigator.share) {
    navigator
      .share({
        title: article.value.title,
        text: `推荐阅读: ${article.value.title}`,
        url: url
      })
      .catch(() => handleCopyLink())
  } else {
    handleCopyLink()
  }
}

// 复制链接
const handleCopyLink = () => {
  const url = window.location.href
  navigator.clipboard
    .writeText(url)
    .then(() => ElMessage.success('链接已复制到剪贴板'))
    .catch(() => ElMessage.error('复制失败，请手动复制'))
}

// 目录跳转
const scrollToAnchor = (id) => {
  nextTick(() => {
    // 尝试直接获取ID元素
    let element = document.getElementById(id)

    // 如果直接获取失败，尝试通过选择器获取
    if (!element) {
      element = document.querySelector(`#${id}`)
    }

    // 如果仍然找不到，尝试通过标题文本查找
    if (!element && toc.value.length) {
      const targetItem = toc.value.find((item) => item.id === id)
      if (targetItem) {
        const headers = document.querySelectorAll('.markdown-content h2, .markdown-content h3')
        element = Array.from(headers).find(
          (header) => header.textContent.trim() === targetItem.text.trim()
        )
      }
    }

    if (element) {
      // 平滑滚动到目标位置，距离顶部80px
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // 高亮效果
      element.classList.add('toc-highlight')
      setTimeout(() => element.classList.remove('toc-highlight'), 2000)
    } else {
      console.warn(`未找到ID为${id}的元素`)
      ElMessage.warning('无法跳转到指定章节')
    }
  })
}

// 标签点击
const handleTagClick = (tag) => {
  router.push({
    path: '/search',
    query: { keyword: tag }
  })
}

// 分类搜索
const handleCategorySearch = (category) => {
  router.push({
    path: '/search',
    query: { keyword: category }
  })
}

// 文章跳转
const navigateToArticle = (id) => {
  if (!id || id === articleId.value) return
  window.scrollTo({ top: 0, behavior: 'auto' })
  router.push(`/article/${id}`)
}

// 加载文章数据
const loadArticleData = () => {
  if (!articleId.value) {
    loading.value = false
    return
  }

  loading.value = true
  // 重置状态
  article.value = null
  isLiked.value = false
  toc.value = []

  try {
    // 先尝试从数据存储获取
    article.value = dataStore.getArticleById(articleId.value) || null

    // 如果数据存储中没有，使用示例数据作为备用
    if (!article.value) {
      console.log('使用示例数据作为备用')
      article.value = {
        id: articleId.value,
        title: '前端开发入门指南',
        date: new Date().toISOString(),
        views: 1243,
        likes: 89,
        tags: ['前端开发', 'JavaScript', 'Vue'],
        cover: 'https://picsum.photos/800/400',
        content: `# 前端开发基础\n\n前端开发是创建Web页面或App等前端界面呈现给用户的过程。\n\n## HTML基础\n\nHTML是构建Web页面的基础，定义了网页的结构。\n\n### HTML标签\n\n常用的HTML标签包括div、span、p等，各有不同的用途。\n\n## CSS样式\n\nCSS用于美化网页，控制HTML元素的布局和外观。\n\n## JavaScript交互\n\nJavaScript为网页添加交互功能，使页面更加生动。\n\n通过Vue、React等框架可以更高效地开发复杂的前端应用。`,
        notes: '本文适合前端初学者参考，建议结合实际项目练习。',
        codeExample: `// Vue组件示例
export default {
  data() {
    return {
      message: 'Hello World'
    }
  },
  methods: {
    greet() {
      alert(this.message);
    }
  }
}`
      }
    }

    // 获取热门文章 - 如果获取失败则使用示例数据
    popularArticles.value = dataStore.getPopularArticles(5) || [
      { id: 2, title: 'Vue3组件开发最佳实践' },
      { id: 3, title: 'JavaScript异步编程全解析' },
      { id: 4, title: 'CSS Grid布局完全指南' },
      { id: 5, title: '前端性能优化实战' },
      { id: 6, title: 'TypeScript入门到精通' }
    ]

    // 确保相关文章始终有数据
    relatedArticles.value = dataStore.getRelatedArticles(
      article.value?.tags || [],
      articleId.value,
      2
    ) || [
      {
        id: 7,
        title: 'Vue组件间通信方式总结',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        tags: ['Vue', '前端开发']
      },
      {
        id: 8,
        title: '现代JavaScript特性详解',
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        tags: ['JavaScript', '前端开发']
      }
    ]

    // 更新阅读量
    if (article.value && article.value.views !== undefined) {
      article.value.views++
      try {
        dataStore.updateArticleViews(articleId.value, article.value.views)
      } catch (e) {
        console.log('更新阅读量失败，使用本地更新')
      }
    }

    // 检查是否已点赞
    try {
      isLiked.value = dataStore.isArticleLiked(articleId.value) || false
    } catch (e) {
      console.log('检查点赞状态失败，默认未点赞')
      isLiked.value = false
    }
  } catch (error) {
    console.error('加载文章数据失败:', error)
    // 即使出错也显示示例文章，避免空白页面
    article.value = {
      id: articleId.value,
      title: '前端开发入门指南',
      date: new Date().toISOString(),
      views: 1243,
      likes: 89,
      tags: ['前端开发', 'JavaScript', 'Vue'],
      content:
        '加载正式数据失败，显示示例内容。前端开发是创建Web页面或App等前端界面呈现给用户的过程。'
    }
    // 确保相关文章在出错时也有数据
    relatedArticles.value = [
      {
        id: 7,
        title: 'Vue组件间通信方式总结',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        tags: ['Vue', '前端开发']
      },
      {
        id: 8,
        title: '现代JavaScript特性详解',
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        tags: ['JavaScript', '前端开发']
      }
    ]
    ElMessage.warning('加载正式数据失败，显示示例内容')
  } finally {
    loading.value = false
  }
}

// 初始化加载
onMounted(() => {
  // 确保DOM加载完成后再加载数据
  nextTick(() => {
    loadArticleData()
  })
})
</script>

<style scoped>
/* 基础样式 */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 面包屑导航 */
.breadcrumb-container {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color);
  font-size: 0.9rem;
  background-color: var(--el-bg-color);
}

/* 主要内容区 */
.main-content {
  padding: 30px 20px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

/* 文章主体 */
.article-main {
  min-width: 0;
}

.article-skeleton {
  width: 100%;
  padding: 20px;
}

.article-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;
  padding: 36px;
  margin-bottom: 30px;
  transition: all 0.3s;
  animation: fadeIn 0.5s ease-in-out;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 文章头部 */
.article-header {
  margin-bottom: 30px;
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 24px;
  color: var(--el-text-color-primary);
  position: relative;
  padding-bottom: 12px;
}

.article-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 3px;
  background-color: #3b82f6;
  border-radius: 2px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.publish-info {
  display: flex;
  gap: 18px;
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}

.article-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.article-tags .el-tag {
  transition: all 0.2s;
  cursor: pointer;
  animation: fadeIn 0.5s ease-in-out;
}

.article-tags .el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* 文章内容 */
.article-cover {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.article-cover:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.cover-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-content {
  line-height: 1.8;
  color: var(--el-text-color-regular);
  font-size: 1rem;
}

/* Markdown内容样式 */
.markdown-content h2,
.markdown-content h3 {
  margin: 1.8rem 0 1rem;
  color: var(--el-text-color-primary);
  font-weight: 600;
  position: relative;
  padding-left: 12px;
  transition: background-color 0.3s, transform 0.3s;
  animation: fadeIn 0.5s ease-in-out;
}

.markdown-content h2.toc-highlight,
.markdown-content h3.toc-highlight {
  background-color: rgba(59, 130, 246, 0.1);
  transform: translateX(5px);
}

.markdown-content h2 {
  font-size: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--el-border-color);
}

.markdown-content h2::before,
.markdown-content h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 4px;
  height: calc(100% - 16px);
  background-color: #3b82f6;
  border-radius: 2px;
}

.markdown-content h3 {
  font-size: 1.25rem;
}

.markdown-content p {
  margin-bottom: 1.2rem;
  animation: fadeIn 0.5s ease-in-out;
}

.markdown-content img {
  max-width: 100%;
  margin: 1.5rem auto;
  display: block;
  border-radius: 4px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}

.markdown-content img:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.markdown-content pre {
  background-color: #1e293b;
  padding: 1.2rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1.5rem 0;
  font-size: 0.9rem;
  line-height: 1.6;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}

.markdown-content pre:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.markdown-content code {
  font-family: 'Fira Code', monospace;
}

.markdown-content blockquote {
  border-left: 3px solid #3b82f6;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background-color: #eff6ff;
  border-radius: 0 4px 4px 0;
  animation: fadeIn 0.5s ease-in-out;
}

/* 注意事项卡片 */
.tips-card {
  margin: 25px 0;
  border-left: 4px solid #f59e0b;
  border-radius: 0 4px 4px 0;
  background-color: #fffbeb;
  border-top: none;
  border-right: none;
  border-bottom: none;
  box-shadow: none;
  animation: fadeIn 0.5s ease-in-out;
  transition: transform 0.3s ease;
}

.tips-card:hover {
  transform: translateX(5px);
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d97706;
  font-weight: 500;
}

/* 文章操作区 */
.article-actions {
  display: flex;
  gap: 20px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-secondary);
  transition: all 0.2s;
  padding: 4px 10px;
  border-radius: 4px;
}

.action-btn:hover {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

/* 相关推荐 - 修复样式 */
.related-articles {
  margin-top: 40px;
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.5s ease-in-out;
}

.related-title {
  font-size: 1.25rem;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color);
}

.related-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background-color: #3b82f6;
  border-radius: 2px;
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.related-card {
  border: 1px solid var(--el-border-color);
  transition: all 0.3s;
  cursor: pointer;
  border-radius: 6px;
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
  overflow: hidden;
}

.related-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}

.related-item {
  padding: 16px;
}

.related-item-title {
  font-size: 1rem;
  margin-bottom: 8px;
  transition: color 0.2s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-card:hover .related-item-title {
  color: #3b82f6;
}

.related-item-meta {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
}

/* 无相关文章时的样式 */
.no-related {
  padding: 20px;
  text-align: center;
  color: var(--el-text-color-secondary);
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  margin-top: 16px;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}

.sidebar-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-title::before {
  content: '';
  width: 3px;
  height: 16px;
  background-color: #3b82f6;
  border-radius: 2px;
}

/* 目录样式 */
.toc-list {
  padding: 10px 0;
}

.toc-item {
  padding: 8px 10px;
  transition: all 0.2s;
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}

.toc-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  transform: translateX(3px);
}

.toc-item-h3 {
  padding-left: 20px;
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
}

/* 分类和热门文章样式 */
.category-list,
.resource-list {
  padding: 10px 0;
}

.category-item,
.resource-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  transition: all 0.2s;
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: pointer;
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}

.category-item:hover,
.resource-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  transform: translateX(3px);
}

.category-item {
  justify-content: space-between;
}

.resource-item {
  gap: 10px;
}

.category-count {
  background-color: #dbeafe;
  color: #3b82f6;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  transition: all 0.2s;
}

.category-item:hover .category-count {
  background-color: #3b82f6;
  color: white;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .related-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sidebar {
    grid-template-columns: 1fr;
  }

  .article-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 576px) {
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .article-title {
    font-size: 1.5rem;
  }

  .related-articles {
    padding: 15px;
  }
}

/* 深色模式适配 */
:deep(.dark) {
  --el-bg-color: #111827;
  --el-bg-color-dark: #1f2937;
  --el-text-color-primary: #f9fafb;
  --el-text-color-regular: #e5e7eb;
  --el-text-color-secondary: #9ca3af;
  --el-border-color: #374151;
}

:deep(.dark) .tips-card {
  background-color: #372e06;
}

:deep(.dark) .markdown-content blockquote {
  background-color: rgba(59, 130, 246, 0.1);
}

:deep(.dark) .category-count {
  background-color: rgba(59, 130, 246, 0.2);
}

:deep(.dark) .related-articles {
  background-color: #1f2937;
}
</style>
