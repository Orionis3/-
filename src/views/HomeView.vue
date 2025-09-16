<template>
  <div class="home-container">
    <!-- 顶部个人信息和旋转菜单 -->
    <div class="home-header">
      <!-- 头像卡片 - 居左 -->
      <AvatarCard :profile="profile" class="avatar-card" />

      <!-- 进度条区域 - 居中偏左 -->
      <div class="demo-progress">
        <div class="progress-item">
          <span class="progress-label">Html+CSS+Js</span>
          <el-progress :percentage="85" :stroke-width="12" striped striped-flow :duration="49" />
        </div>
        <div class="progress-item">
          <span class="progress-label">Vue3+Vite+Element-Plus</span>
          <el-progress
            :percentage="70"
            :stroke-width="12"
            striped
            striped-flow
            :duration="49"
            color="#CF9136"
          />
        </div>
        <div class="progress-item">
          <span class="progress-label">Node.js</span>
          <el-progress
            :percentage="65"
            :stroke-width="12"
            striped
            striped-flow
            :duration="49"
            color="#5CAE34"
          />
        </div>
        <div class="progress-item">
          <span class="progress-label">Pinia</span>
          <el-progress
            :percentage="70"
            :stroke-width="12"
            striped
            striped-flow
            :duration="49"
            color="#DC6161"
          />
        </div>
      </div>

      <!-- 学习时间统计 - 居右（美化后） -->
      <div class="learning-time">
        <el-col :xs="24" class="text-center">
          <!-- 美化标题 -->
          <div class="time-title">已学习前端</div>
          <!-- 美化计时器容器 -->
          <div class="time-container">
            <!-- 数字块：天 -->
            <div class="time-block">
              <span class="time-number">{{ days }}</span>
              <span class="time-unit">天</span>
            </div>
            <span class="time-separator">:</span>
            <!-- 数字块：时 -->
            <div class="time-block">
              <span class="time-number">{{ hours }}</span>
              <span class="time-unit">时</span>
            </div>
            <span class="time-separator">:</span>
            <!-- 数字块：分 -->
            <div class="time-block">
              <span class="time-number">{{ minutes }}</span>
              <span class="time-unit">分</span>
            </div>
            <span class="time-separator">:</span>
            <!-- 数字块：秒 -->
            <div class="time-block">
              <span class="time-number">{{ seconds }}</span>
              <span class="time-unit">秒</span>
            </div>
          </div>
        </el-col>
      </div>
    </div>

    <!-- 最新文章区域（完全保留原代码） -->
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

    <!-- 旅行和书籍快速入口（完全保留原代码） -->
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
          <el-icon><Notebook /></el-icon>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import AvatarCard from '@/components/ui/AvatarCard.vue'
import ArticleCard from '@/components/ui/ArticleCard.vue'
import { EditPen, Right, MapLocation, Notebook } from '@element-plus/icons-vue'

// 学习时间统计核心逻辑
const learningStartTime = ref(new Date('2021-06-15T09:00:00').getTime())
const currentTime = ref(Date.now())
let timer = null

// 组件挂载/卸载：启动/清除定时器
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})

// 拆分时间为单独变量（方便美化样式）
const timeDiff = computed(() => currentTime.value - learningStartTime.value)
const days = computed(() =>
  String(Math.floor(timeDiff.value / (1000 * 60 * 60 * 24))).padStart(2, '0')
)
const hours = computed(() =>
  String(Math.floor((timeDiff.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0')
)
const minutes = computed(() =>
  String(Math.floor((timeDiff.value % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')
)
const seconds = computed(() =>
  String(Math.floor((timeDiff.value % (1000 * 60)) / 1000)).padStart(2, '0')
)

// 以下代码完全保留原样
const dataStore = useDataStore()
const profile = computed(() => dataStore.profile)
const articles = computed(() => dataStore.articles)
const travels = computed(() => dataStore.travels)
const books = computed(() => dataStore.books)

const latestArticles = computed(() => {
  return [...articles.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
})
</script>

<style scoped>
/* 完全保留你原有的所有样式，仅新增计时器美化样式 */
.home-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
}

/* 头部布局 - 三栏式分布 */
.home-header {
  display: flex;
  width: 100%;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap; /* 响应式换行 */
}

/* 头像卡片样式 - 缩小尺寸并居左 */
.avatar-card {
  flex: 0 0 220px; /* 固定宽度 */
  max-width: 220px;
}

/* 进度条区域 - 居中偏左 */
.demo-progress {
  flex: 1; /* 占中间大部分空间 */
  min-width: 300px;
  padding: 0 15px;
}

.progress-item {
  margin-bottom: 12px;
}

.progress-label {
  display: inline-block;
  width: 100%;
  margin-bottom: 5px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 100%;
}

/* 学习时间统计 - 居右（新增美化样式） */
.learning-time {
  flex: 0 0 280px; /* 微调宽度适配美化后的计时器 */
  text-align: center;
  min-width: 240px;
  padding: 15px 10px;
}

/* 计时器标题美化 */
.time-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-color-primary);
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
}

/* 计时器容器美化：渐变背景+发光边框 */
.time-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 8px;
  background: linear-gradient(135deg, var(--el-bg-color), var(--el-bg-color-light-900));
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(64, 158, 255, 0.1), inset 0 0 5px rgba(255, 255, 255, 0.5);
}

/* 时间块：独立卡片样式 */
.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  padding: 8px 0;
  background: var(--el-bg-color);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-light);
  transition: all 0.3s ease;
}

/* 鼠标悬浮时间块：轻微上浮+边框变色 */
.time-block:hover {
  transform: translateY(-2px);
  border-color: var(--el-color-primary);
  box-shadow: 0 3px 8px rgba(64, 158, 255, 0.2);
}

/* 时间数字：高亮+粗体 */
.time-number {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-color-primary);
  font-family: 'Arial', 'Microsoft YaHei', sans-serif;
  letter-spacing: 0;
}

/* 时间单位：小字体+浅色调 */
.time-unit {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

/* 时间分隔符：动态闪烁效果 */
.time-separator {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-color-primary);
  animation: blink 1s infinite;
}

/* 分隔符闪烁动画 */
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 其他原有样式保持不变 */
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

/* 响应式调整：适配移动端 */
@media (max-width: 768px) {
  .home-header {
    flex-direction: column;
    align-items: center;
  }

  .avatar-card,
  .learning-time {
    flex: none;
    max-width: 100%;
    width: 100%;
  }

  /* 移动端计时器适配 */
  .time-container {
    gap: 5px;
    padding: 10px 5px;
  }

  .time-block {
    width: 45px;
    padding: 6px 0;
  }

  .time-number {
    font-size: 16px;
  }
}
</style>
