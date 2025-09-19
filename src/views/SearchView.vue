<template>
  <div class="search-container">
    <el-page-header @back="handleBack" :content="`搜索结果: '${keyword}'`" />

    <!-- 搜索框 -->
    <el-input
      v-model="keyword"
      placeholder="继续搜索..."
      class="search-input"
      @keyup.enter="handleSearch"
    >
      <template #append>
        <el-button icon="Search" @click="handleSearch" />
      </template>
    </el-input>

    <!-- 搜索结果统计 -->
    <div class="search-stats" v-if="results.length > 0">找到 {{ results.length }} 条相关结果</div>

    <!-- 按类型分组展示结果 -->
    <div class="search-results">
      <!-- 文章结果 -->
      <div v-if="groupedResults.文章 && groupedResults.文章.length">
        <h3 class="result-type">
          <el-icon><EditPen /></el-icon> 技术文章
        </h3>
        <el-divider />
        <div class="result-list">
          <el-card
            v-for="item in groupedResults.文章"
            :key="item.id"
            class="result-item article-card"
            @click="$router.push(`/articles/${item.id}`)"
            tabindex="0"
            role="button"
          >
            <h4 class="result-title" v-html="highlightKeyword(item.title)"></h4>
            <p
              class="result-excerpt"
              v-html="highlightKeyword(item.summary || item.content.substring(0, 100) + '...')"
            ></p>
            <div class="result-meta">
              <span>{{ item.date }}</span>
              <span>标签: {{ item.tags.join(', ') }}</span>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 旅行日记结果 -->
      <div v-if="groupedResults.旅行日记 && groupedResults.旅行日记.length">
        <h3 class="result-type">
          <el-icon><MapLocation /></el-icon> 旅行日记
        </h3>
        <el-divider />
        <div class="result-list">
          <el-card
            v-for="item in groupedResults.旅行日记"
            :key="item.id"
            class="result-item article-card"
            @click="$router.push(`/travel/${item.id}`)"
            tabindex="0"
            role="button"
          >
            <h4 class="result-title" v-html="highlightKeyword(item.title)"></h4>
            <p
              class="result-excerpt"
              v-html="highlightKeyword(item.summary || item.content.substring(0, 100) + '...')"
            ></p>
            <div class="result-meta">
              <span>{{ item.date }}</span>
              <span>地点: {{ item.location }}</span>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 书籍结果 -->
      <div v-if="groupedResults.书籍 && groupedResults.书籍.length">
        <h3 class="result-type">
          <el-icon><Notebook /></el-icon> 书籍
        </h3>
        <el-divider />
        <div class="result-list">
          <el-card
            v-for="item in groupedResults.书籍"
            :key="item.id"
            class="result-item article-card"
            tabindex="0"
            role="button"
          >
            <h4 class="result-title" v-html="highlightKeyword(item.title)"></h4>
            <p
              class="result-excerpt"
              v-html="highlightKeyword(item.review || item.notes || '')"
            ></p>
            <div class="result-meta">
              <span>作者: {{ item.author }}</span>
              <span>{{ item.status === 'finished' ? '已读完' : '阅读中' }}</span>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 无结果状态 -->
    <el-empty v-if="keyword && results.length === 0" description="未找到相关内容，请尝试其他关键词">
      <template #footer>
        <div class="suggestions">
          <h4>热门推荐</h4>
          <el-tag v-for="tag in hotTags" :key="tag" @click="handleHotTagClick(tag)" class="hot-tag">
            {{ tag }}
          </el-tag>
        </div>
      </template>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import { EditPen, MapLocation, Notebook } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const dataStore = useDataStore()

// 搜索关键词
const keyword = ref(route.query.keyword || '')

// 搜索结果
const results = ref([])

// 热门标签（推荐）
const hotTags = ['Vue3', 'JavaScript', '前端开发', '读书笔记', '旅行攻略']

// 分组后的结果
const groupedResults = computed(() => {
  return results.value.reduce((groups, item) => {
    const type = item.type
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(item)
    return groups
  }, {})
})

// 页面加载时执行搜索
onMounted(() => {
  if (keyword.value) {
    performSearch()
  }
})

// 执行搜索
const performSearch = () => {
  results.value = dataStore.searchContent(keyword.value)
}

// 处理搜索
const handleSearch = () => {
  if (keyword.value.trim()) {
    // 更新URL参数
    router.push({
      path: '/search',
      query: { keyword: keyword.value.trim() }
    })
    performSearch()
  }
}

// 点击热门标签搜索
const handleHotTagClick = (tag) => {
  keyword.value = tag
  handleSearch()
}

// 处理返回
const handleBack = () => {
  router.back()
}

// 高亮关键词
const highlightKeyword = (text) => {
  if (!text || !keyword.value) return text
  const regex = new RegExp(`(${keyword.value})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-input {
  width: 500px;
  margin: 0 auto;
}

.search-stats {
  color: var(--el-text-color-secondary);
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.result-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.result-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-title {
  margin-bottom: 8px;
  font-size: 16px;
}

.result-excerpt {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 1.6;
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.highlight {
  color: var(--el-color-primary);
  font-weight: bold;
}

.suggestions {
  margin-top: 20px;
}

.suggestions h4 {
  margin-bottom: 10px;
  font-size: 14px;
}

.hot-tag {
  margin: 0 5px 5px 0;
  cursor: pointer;
}

/* 移除原有的hover样式，使用全局统一的卡片样式 */
</style>
