<template>
  <div class="page-container">
    <!-- 文章头部导航 - 标题栏区域 -->
    <div class="article-header-nav">
      <el-page-header @back="handleBack">
        <template #content>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/articles' }">文章</el-breadcrumb-item>
            <el-breadcrumb-item>{{ article?.title || '加载中...' }}</el-breadcrumb-item>
          </el-breadcrumb>
        </template>
      </el-page-header>
    </div>

    <!-- 主要内容区 -->
    <div class="container">
      <div class="main-content">
        <div class="content-wrapper">
          <!-- 文章主体 -->
          <div class="article-main">
            <el-skeleton active v-if="loading" class="article-skeleton" />

            <el-card v-else-if="article" class="article-card">
              <!-- 文章标题 -->
              <h1 class="article-title">{{ article.title }}</h1>

              <!-- 文章元数据 -->
              <div class="article-meta">
                <span class="publish-date">
                  <el-icon size="16"><Calendar /></el-icon>
                  {{ formatDate(article.date) }}
                </span>
                <span class="view-count">
                  <el-icon size="16"><Eye /></el-icon>
                  {{ article.views }} 阅读
                </span>
              </div>

              <!-- 文章标签 -->
              <div class="article-tags">
                <el-tag
                  v-for="tag in article.tags"
                  :key="tag"
                  type="info"
                  effect="light"
                  class="article-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>

              <!-- 文章封面 -->
              <div class="article-cover" v-if="article.cover">
                <img
                  :src="resolveImageUrl(article.cover)"
                  :alt="article.title"
                  class="cover-image"
                />
              </div>

              <!-- 文章内容 -->
              <div class="article-content">
                <div v-html="renderedContent" class="markdown-content" ref="markdownContent"></div>

                <!-- 注意事项卡片 -->
                <el-card class="tips-card" v-if="article.notes || article.tips">
                  <template #header>
                    <div class="tips-header">
                      <el-icon><WarningFilled /></el-icon>
                      <span>注意事项</span>
                    </div>
                  </template>
                  <div class="tips-content">
                    <p>{{ article.notes || article.tips }}</p>
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
                  <el-icon :color="isLiked ? '#36d399' : ''">
                    <svg
                      class="icon"
                      aria-hidden="true"
                      :style="{ color: isLiked ? '#36d399' : '' }"
                    >
                      <use xlink:href="#icon-xihuan"></use></svg
                  ></el-icon>
                  <span>{{ isLiked ? '已点赞' : '点赞' }}</span>
                </el-button>
                <el-button type="text" class="action-btn" @click="handleShare">
                  <el-icon><Share /></el-icon>
                  <span>分享</span>
                </el-button>
                <el-button type="text" class="action-btn" @click="handleCopyLink">
                  <el-icon><CopyDocument /></el-icon>
                  <span>复制链接</span>
                </el-button>
                <el-button type="text" class="action-btn" @click="handleComment">
                  <el-icon><Message /></el-icon>
                  <span>评论</span>
                </el-button>
              </div>
            </el-card>

            <!-- 文章未找到提示 -->
            <div v-else class="article-not-found">
              <el-empty description="未找到该文章内容" />
              <el-button class="back-button" @click="handleBack">返回文章列表</el-button>
            </div>

            <!-- 相关文章推荐 -->
            <div class="related-articles">
              <h3 class="related-title">
                <el-icon><Document /></el-icon> 相关推荐
              </h3>
              <div v-if="relatedArticles.length > 0" class="related-list">
                <el-card
                  v-for="(item, index) in relatedArticles"
                  :key="item.id"
                  class="related-card"
                  :style="{ animationDelay: `${index * 100}ms` }"
                  @click="navigateToArticle(item.id)"
                >
                  <div class="related-item">
                    <h4 class="related-item-title">{{ item.title }}</h4>
                    <div class="related-item-meta">
                      <span>{{ formatDate(item.date) }}</span>
                      <span>
                        <el-icon size="12"><Eye /></el-icon>
                        {{ item.views || Math.floor(Math.random() * 1000) + 100 }}
                      </span>
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
                  :class="{ 'toc-item-h3': item.level === 3, active: activeTocId === item.id }"
                  @click="scrollToAnchor(item.id)"
                >
                  {{ item.text }}
                </div>
              </div>
            </el-card>

            <!-- 文章标签云 - 替换原技术分类 -->
            <el-card class="sidebar-card">
              <template #header>
                <h3 class="sidebar-title">相关标签</h3>
              </template>
              <div class="tag-cloud">
                <el-tag
                  v-for="(tag, index) in allRelatedTags"
                  :key="tag.name"
                  :type="isCurrentArticleTag(tag.name) ? 'primary' : 'info'"
                  :effect="isCurrentArticleTag(tag.name) ? 'dark' : 'light'"
                  :size="getTagSize(tag.count)"
                  class="cloud-tag"
                  @click="handleTagSearch(tag.name)"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  {{ tag.name }}
                  <span class="tag-count">({{ tag.count }})</span>
                </el-tag>
              </div>
            </el-card>

            <!-- 作者信息 - 新增内容 -->
            <el-card class="sidebar-card">
              <template #header>
                <h3 class="sidebar-title">作者信息</h3>
              </template>
              <div class="author-info">
                <el-avatar :size="60" class="author-avatar">
                  <img :src="profile.avatar" alt="作者头像" />
                </el-avatar>
                <h4 class="author-name">{{ profile.name }}</h4>
                <p class="author-intro">{{ profile.intro }}</p>

                <div class="author-stats">
                  <div class="stat-item">
                    <span class="stat-value">{{ stats.articleCount }}</span>
                    <span class="stat-label">文章</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ stats.travelCount }}</span>
                    <span class="stat-label">旅行</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ stats.bookCount }}</span>
                    <span class="stat-label">书籍</span>
                  </div>
                </div>

                <el-button type="text" class="view-profile" @click="$router.push('/about')">
                  查看更多
                </el-button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import {
  Calendar,
  Eye,
  WarningFilled,
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

// 计算属性获取路由参数，确保响应式
const articleId = computed(() => route.params.id)

// 状态
const loading = ref(true)
const article = ref(null)
const isLiked = ref(false)
const toc = ref([])
const renderedContent = ref('')
const activeTocId = ref('') // 用于高亮当前激活的目录项
const markdownContent = ref(null) // 用于获取文章内容DOM元素
const popularArticles = ref([])
const relatedArticles = ref([])
const allRelatedTags = ref([]) // 所有相关标签
const profile = ref({}) // 作者信息
const stats = ref({
  articleCount: 0,
  travelCount: 0,
  bookCount: 0
})

// 处理图片路径
const resolveImageUrl = (url) => {
  if (!url) return ''
  // 检查是否为绝对路径
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 检查是否为Base64
  if (url.startsWith('data:image/')) {
    return url
  }
  // 假设相对路径图片存储在public/images目录下
  return `/images/${url}`
}

// 处理Markdown内容中的图片路径
const processMarkdownContent = (content) => {
  if (!content) return ''

  // 匹配Markdown图片语法并替换路径
  return content.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
    const resolvedUrl = resolveImageUrl(url)
    return `![${alt}](${resolvedUrl})`
  })
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

// 加载文章数据 - 确保正确处理异步操作
const loadArticleData = async () => {
  // 确保id有效
  if (!articleId.value) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    // 确保数据仓库已加载数据
    if (dataStore.articles.length === 0) {
      await dataStore.loadAllData()
    }

    // 从数据仓库获取文章
    const articleData = dataStore.getArticleById(articleId.value)

    if (articleData) {
      article.value = articleData
      // 处理并渲染文章内容
      const processedContent = processMarkdownContent(articleData.content)
      renderedContent.value = marked(processedContent)

      // 等待内容渲染后再生成目录
      await nextTick()
      generateTocFromRenderedContent()

      // 加载相关标签
      loadRelatedTags(articleData.tags)
    } else {
      // 未找到文章时的处理
      console.warn(`文章 ${articleId.value} 未找到`)
      article.value = null
      renderedContent.value = ''
      toc.value = []
      allRelatedTags.value = []
    }

    // 获取作者信息和统计数据
    profile.value = dataStore.profile || {
      name: '博主',
      intro: '热爱技术与分享的开发者',
      avatar: '/images/avatar-default.png'
    }

    // 统计数据
    stats.value = {
      articleCount: dataStore.articles.length || 0,
      travelCount: dataStore.travels.length || 0,
      bookCount: dataStore.books.length || 0
    }

    // 获取热门文章
    popularArticles.value = dataStore.getPopularArticles(5) || [
      { id: 2, title: 'Vue3组件开发最佳实践' },
      { id: 3, title: 'JavaScript异步编程全解析' },
      { id: 4, title: 'CSS Grid布局完全指南' },
      { id: 5, title: '前端性能优化实战' },
      { id: 6, title: 'TypeScript入门到精通' }
    ]

    // 获取相关文章
    relatedArticles.value = dataStore.getRelatedArticles(
      article.value?.tags || [],
      articleId.value,
      2
    ) || [
      {
        id: 7,
        title: 'Vue组件间通信方式总结',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        tags: ['Vue', '组件通信']
      },
      {
        id: 8,
        title: '现代JavaScript特性详解',
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        tags: ['JavaScript', '前端开发']
      }
    ]
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.warning('加载文章内容失败，请稍后重试')
    // 错误处理：确保显示错误状态而非空白
    article.value = {
      id: articleId.value,
      title: '文章加载失败',
      date: new Date().toISOString(),
      tags: ['错误'],
      views: 0,
      content: '# 文章加载失败\n\n很抱歉，无法加载该文章内容。请尝试刷新页面或稍后再试。',
      notes: '如果问题持续，请联系管理员'
    }
    renderedContent.value = marked(article.value.content)
    await nextTick()
    generateTocFromRenderedContent()
    loadRelatedTags(article.value.tags)
  } finally {
    loading.value = false
  }
}

// 加载相关标签
const loadRelatedTags = (articleTags) => {
  // 从所有文章中收集标签并计数
  const tagMap = new Map()

  // 先添加当前文章的标签
  articleTags.forEach((tag) => {
    tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
  })

  // 再添加其他文章的标签
  dataStore.articles.forEach((art) => {
    if (art.id !== articleId.value) {
      art.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    }
  })

  // 转换为数组并排序
  allRelatedTags.value = Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15) // 限制最多显示15个标签
}

// 判断是否是当前文章的标签
const isCurrentArticleTag = (tagName) => {
  return article.value?.tags?.includes(tagName) || false
}

// 根据标签数量确定标签大小
const getTagSize = (count) => {
  if (count > 5) return 'large'
  if (count > 2) return 'medium'
  return 'small'
}

// 从渲染后的内容生成目录（确保ID与实际渲染的一致）
const generateTocFromRenderedContent = () => {
  if (!markdownContent.value) return

  toc.value = []
  // 从渲染后的HTML中获取所有标题元素
  const headings = markdownContent.value.querySelectorAll('h1, h2, h3, h4')

  headings.forEach((heading) => {
    const id = heading.id
    const text = heading.textContent.trim()
    const level = parseInt(heading.tagName.substring(1)) // 从h1得到1，h2得到2等

    if (id && text && level >= 1 && level <= 4) {
      toc.value.push({
        id,
        text,
        level
      })
    }
  })
}

const scrollToAnchor = (id) => {
  // 使用nextTick确保DOM已更新
  nextTick(() => {
    const element = document.getElementById(id)
    if (!element) {
      console.warn(`未找到ID为${id}的元素`)
      return
    }

    // 计算所有需要考虑的固定元素高度
    const headerNav = document.querySelector('.article-header-nav')
    const headerHeight = headerNav ? headerNav.offsetHeight : 0

    // 获取元素在文档中的位置
    const rect = element.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // 计算目标滚动位置（减去固定头部高度和额外间距）
    const targetPosition = scrollTop + rect.top - headerHeight - 20

    // 执行滚动
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })

    // 手动设置当前激活的目录项
    activeTocId.value = id
  })
}

// 监听滚动，更新当前激活的目录项
const handleScroll = () => {
  if (toc.value.length === 0) return

  const scrollPosition = window.scrollY + 100 // 增加偏移量，提前激活目录项

  // 获取导航高度
  const headerNav = document.querySelector('.article-header-nav')
  const headerHeight = headerNav ? headerNav.offsetHeight : 0

  // 从后往前检查，找到第一个在视口内的标题
  for (let i = toc.value.length - 1; i >= 0; i--) {
    const element = document.getElementById(toc.value[i].id)
    if (element) {
      const elementTop = element.offsetTop - headerHeight - 30
      if (scrollPosition >= elementTop) {
        activeTocId.value = toc.value[i].id
        break
      }
    }
  }
}

// 导航到文章
const navigateToArticle = (id) => {
  router.push(`/articles/${id}`)
}

// 处理标签搜索
const handleTagSearch = (tag) => {
  router.push({ path: '/blog', query: { tag } })
}

// 点赞功能
const handleLike = () => {
  isLiked.value = !isLiked.value
  ElMessage.success(isLiked.value ? '点赞成功' : '取消点赞')
}

// 分享功能
const handleShare = () => {
  const url = window.location.href
  navigator.clipboard
    .writeText(url)
    .then(() => {
      ElMessage.success('链接已复制到剪贴板，快去分享吧！')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制链接')
    })
}

// 复制链接
const handleCopyLink = () => {
  const url = window.location.href
  navigator.clipboard
    .writeText(url)
    .then(() => {
      ElMessage.success('链接已复制')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}

// 评论功能
const handleComment = () => {
  ElMessage.info('评论功能开发中，敬请期待')
}

// 返回上一页逻辑
const handleBack = () => {
  router.back()
}

// 引入阿里矢量图标库 (在组件挂载时执行)
onMounted(() => {
  // 先检查是否已引入，避免重复加载
  if (!document.getElementById('iconfont-article')) {
    const script = document.createElement('script')
    script.id = 'iconfont-article'
    script.src = '//at.alicdn.com/t/c/font_5026412_y4tmvjykubq.js'
    script.type = 'text/javascript'
    document.head.appendChild(script)
  }

  // 原有初始化逻辑保持不变
  nextTick(() => {
    loadArticleData()
    window.addEventListener('scroll', handleScroll)
  })
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 监听路由变化
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      // 重置状态
      article.value = null
      renderedContent.value = ''
      toc.value = []
      activeTocId.value = ''
      allRelatedTags.value = []
      loadArticleData()
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
/* 页面最外层容器 */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 基础样式 */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  flex: 1;
}

/* 文章未找到样式 */
.article-not-found {
  text-align: center;
  padding: 50px 0;
}

.back-button {
  margin-top: 20px;
}

/* 文章头部导航样式 - 标题栏 */
.article-header-nav {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color);
  background-color: var(--el-bg-color);
  position: sticky;
  top: 0;
  z-index: 1000; /* 提高z-index确保不会被其他内容覆盖 */
  width: 100%;
  box-sizing: border-box;
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

.article-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  line-height: 1.4;
  color: var(--el-text-color-primary);
}

.article-meta {
  display: flex;
  gap: 20px;
  color: var(--el-text-color-secondary);
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.article-tag {
  transition: all 0.2s;
}

.article-tag:hover {
  transform: translateY(-2px);
}

.article-cover {
  width: 100%;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: auto;
  transition: all 0.3s ease;
}

.markdown-content {
  line-height: 1.8;
  font-size: 1rem;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4 {
  margin: 1.5rem 0 1rem;
  color: var(--el-text-color-primary);
  scroll-margin-top: 100px; /* 为固定头部预留空间 */
}

.markdown-content h1 {
  font-size: 1.6rem;
  border-bottom: 1px solid var(--el-border-color);
  padding-bottom: 0.5rem;
}

.markdown-content h2 {
  font-size: 1.4rem;
  border-bottom: 1px dashed var(--el-border-color);
  padding-bottom: 0.5rem;
}

.markdown-content h3 {
  font-size: 1.2rem;
}

.markdown-content p {
  margin-bottom: 1rem;
}

.markdown-content ul,
.markdown-content ol {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.markdown-content li {
  margin-bottom: 0.5rem;
}

.markdown-content a {
  color: #3b82f6;
  text-decoration: none;
  transition: all 0.2s;
}

.markdown-content a:hover {
  color: #2563eb;
  text-decoration: underline;
}

.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
}

.tips-card {
  margin: 25px 0;
  border-left: 4px solid #f59e0b;
  border-radius: 0 4px 4px 0;
  background-color: #fffbeb;
  border-top: none;
  border-right: none;
  border-bottom: none;
  box-shadow: none;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d97706;
  font-weight: 500;
}

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

.related-articles {
  margin-top: 40px;
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
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

.no-related {
  padding: 20px;
  text-align: center;
  color: var(--el-text-color-secondary);
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  margin-top: 16px;
}

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

/* 激活的目录项样式 */
.toc-item.active {
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
}

.resource-list {
  padding: 10px 0;
}

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

.resource-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  transform: translateX(3px);
}

.resource-item {
  gap: 10px;
}

/* 标签云样式 */
.tag-cloud {
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cloud-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.cloud-tag:hover {
  transform: translateY(-3px) scale(1.05);
  z-index: 10;
}

.tag-count {
  font-size: 0.7em;
  margin-left: 4px;
  opacity: 0.8;
}

/* 作者信息样式 */
.author-info {
  padding: 15px 10px;
  text-align: center;
}

.author-avatar {
  margin: 0 auto 15px;
  border: 2px solid #f0f2f5;
}

.author-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.author-intro {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
  margin-bottom: 15px;
  padding: 0 10px;
  line-height: 1.5;
}

.author-stats {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
  padding: 0 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
}

.view-profile {
  color: #3b82f6;
  padding: 0;
  font-size: 0.9rem;
}

.view-profile:hover {
  color: #2563eb;
  text-decoration: underline;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .sidebar {
    grid-template-columns: 1fr;
  }

  .article-header-nav {
    padding: 12px 16px;
  }

  .article-card {
    padding: 20px 16px;
  }

  .article-title {
    font-size: 1.5rem;
  }
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor; /* 关键：继承文字颜色，确保hover效果正常 */
  overflow: hidden;
  transition: all 0.2s; /* 保持过渡动画一致 */
}

/* 确保按钮hover时图标颜色跟随文字变化 */
.action-btn:hover .icon {
  color: #3b82f6 !important;
  background-image: url('../components/icons/github-fill.svg');
}
</style>
