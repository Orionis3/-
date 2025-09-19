<template>
  <div class="home-container">
    <!-- 首页头部 -->
    <section class="hero-section">
      <div class="container">
        <div class="profile-card">
          <el-avatar :size="100" class="avatar">
            <img :src="profile?.avatar" alt="个人头像" />
          </el-avatar>
          <h1 class="name">{{ profile?.name }}</h1>
          <p class="intro">{{ profile?.intro }}</p>
          <div class="contact-links">
            <a :href="profile?.contact.github" target="_blank" class="link-item">
              <el-icon><Github /></el-icon>
            </a>
            <a :href="`mailto:${profile?.contact.email}`" class="link-item">
              <el-icon><Message /></el-icon>
            </a>
            <a :href="profile?.contact.blog" target="_blank" class="link-item">
              <el-icon><Document /></el-icon>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据可视化区域 -->
    <section class="charts-section">
      <div class="container">
        <div class="section-header">
          <h2>学习数据统计</h2>
        </div>
        <div class="charts-grid">
          <!-- 学习时间图表 -->
          <el-card class="chart-card">
            <template #header>
              <h3>学习时长统计（天）</h3>
            </template>
            <div class="chart-container">
              <div ref="studyTimeChart" class="chart"></div>
            </div>
          </el-card>

          <!-- 技能掌握图表 -->
          <el-card class="chart-card">
            <template #header>
              <h3>技术掌握程度</h3>
            </template>
            <div class="chart-container">
              <div ref="skillsChart" class="chart"></div>
            </div>
          </el-card>
        </div>
      </div>
    </section>

    <!-- 内容加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <el-skeleton active :rows="6" class="loading-skeleton" />
    </div>

    <!-- 文章列表 -->
    <section v-else class="articles-section">
      <div class="container">
        <div class="section-header">
          <h2>最新文章</h2>
          <router-link to="/blog" class="view-all">查看全部</router-link>
        </div>
        <div class="articles-grid">
          <el-card
            v-for="article in latestArticles"
            :key="article.id"
            class="article-card"
            @click="navigateToArticle(article.id)"
            tabindex="0"
            role="button"
          >
            <div class="article-header">
              <h3 class="article-title">
                {{ article.title }}
              </h3>
            </div>
            <div class="article-content">
              <p class="summary">{{ article.summary }}</p>
              <div class="article-meta">
                <span class="date">{{ formatDate(article.date) }}</span>
                <div class="tags">
                  <el-tag v-for="tag in article.tags" :key="tag" size="small">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </section>

    <!-- 旅行日记 -->
    <section class="travels-section">
      <div class="container">
        <div class="section-header">
          <h2>旅行记忆</h2>
          <router-link to="/travel" class="view-all">查看全部</router-link>
        </div>
        <div class="travels-grid">
          <el-card
            v-for="travel in featuredTravels"
            :key="travel.id"
            class="travel-card"
            @click="navigateToTravel(travel.id)"
            tabindex="0"
            role="button"
          >
            <img :src="travel.coverImage" alt="旅行封面" class="travel-cover" />
            <div class="travel-info">
              <h3 class="travel-title">
                {{ travel.title }}
              </h3>
            </div>
          </el-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, onUnmounted, nextTick } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import { format, eachMonthOfInterval, parseISO } from 'date-fns'
import { Github, Message, Document } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 导航到文章详情
const navigateToArticle = (id) => {
  router.push(`/articles/${id}`)
}

// 导航到旅行详情
const navigateToTravel = (id) => {
  router.push(`/travel/${id}`)
}

// 状态管理
const dataStore = useDataStore()
const isLoading = ref(true)

// 图表相关
const studyTimeChart = ref(null)
const skillsChart = ref(null)
const studyTimeChartInstance = ref(null)
const skillsChartInstance = ref(null)

// 数据获取
const profile = computed(() => dataStore.profile)
const articles = computed(() => dataStore.articles)
const travels = computed(() => dataStore.travels)

// 处理数据
const latestArticles = computed(() => {
  return [...(articles.value || [])].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
})

const featuredTravels = computed(() => {
  return [...(travels.value || [])].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 2)
})

// 工具函数
const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'yyyy-MM-dd')
}

// 初始化学习时间图表 - 从2021年6月15日至今
const initStudyTimeChart = () => {
  if (!studyTimeChart.value) return

  // 计算从开始学习到现在的时间范围
  const startDate = parseISO('2021-06-15')
  const endDate = new Date()

  // 获取这段时间内的所有月份
  const monthsInterval = eachMonthOfInterval({ start: startDate, end: endDate })
  const months = monthsInterval.map((month) => format(month, 'yyyy-MM'))

  // 生成每月学习天数数据（模拟，前几个月递增，中间有波动）
  const studyDays = months.map((_, index) => {
    // 第一个月学习较少
    if (index === 0) return Math.floor(Math.random() * 10) + 5

    // 中间月份稳步增长
    if (index < 12) return Math.floor(Math.random() * 10) + 15 + index

    // 后期保持稳定并略有波动
    return Math.floor(Math.random() * 15) + 20
  })

  studyTimeChartInstance.value = echarts.init(studyTimeChart.value)
  studyTimeChartInstance.value.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: {
        rotate: 45,
        interval: months.length > 18 ? 'auto' : 0
      }
    },
    yAxis: {
      type: 'value',
      name: '学习天数'
    },
    series: [
      {
        name: '学习天数',
        type: 'bar',
        data: studyDays,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4158D0' },
            { offset: 0.5, color: '#C850C0' },
            { offset: 1, color: '#FFCC70' }
          ])
        },
        animationDuration: 1500
      }
    ]
  })
}

// 初始化技能图表 - 四组技术数据
const initSkillsChart = () => {
  if (!skillsChart.value) return

  skillsChartInstance.value = echarts.init(skillsChart.value)
  skillsChartInstance.value.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}%'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    radar: {
      indicator: [
        { name: 'HTML+CSS+JS', max: 100 },
        { name: 'Vue3+Element+Pinia', max: 100 },
        { name: 'ECharts', max: 100 },
        { name: 'Node.js', max: 100 }
      ],
      splitArea: {
        areaStyle: {
          color: ['rgba(255,255,255,0.2)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0,0,0,0.2)'
        }
      }
    },
    series: [
      {
        name: '掌握程度',
        type: 'radar',
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3
        },
        emphasis: {
          focus: 'series'
        },
        data: [
          {
            value: [90, 85, 75, 65], // 对应四组技术的掌握程度
            name: '当前掌握度',
            itemStyle: {
              color: '#3b82f6'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(59, 130, 246, 0.8)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.2)' }
              ])
            }
          }
        ],
        animationDuration: 2000
      }
    ]
  })
}

// 处理窗口大小变化
const handleResize = () => {
  studyTimeChartInstance.value?.resize()
  skillsChartInstance.value?.resize()
}

onMounted(() => {
  // 确保数据加载完成
  if (articles.value.length === 0) {
    dataStore
      .loadAllData()
      .then(() => {
        // 数据加载成功后更新UI
        isLoading.value = false
      })
      .catch((error) => {
        console.error('数据加载失败:', error)
        isLoading.value = false
        // 可以添加错误提示
      })
  } else {
    isLoading.value = false
  }

  // 初始化图表
  nextTick(() => {
    setTimeout(() => {
      initStudyTimeChart()
      initSkillsChart()
      window.addEventListener('resize', handleResize)
    }, 500)
  })
})

// 组件卸载时销毁图表
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  studyTimeChartInstance.value?.dispose()
  skillsChartInstance.value?.dispose()
})
</script>

<style scoped>
.home-container {
  padding-bottom: 60px;
}

.hero-section {
  padding: 60px 0;
  text-align: center;
  background-color: var(--el-bg-color);
  margin-bottom: 40px;
}

.profile-card {
  max-width: 600px;
  margin: 0 auto;
}

.avatar {
  margin: 0 auto 20px;
}

.name {
  font-size: 2rem;
  margin-bottom: 10px;
}

.intro {
  color: var(--el-text-color-secondary);
  margin-bottom: 20px;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.link-item {
  color: var(--el-color-primary);
  font-size: 1.5rem;
  transition: color 0.3s, transform 0.3s;
}

.link-item:hover {
  color: var(--el-color-primary-light);
  transform: scale(1.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.view-all {
  color: var(--el-color-primary);
  font-size: 0.9rem;
  transition: all 0.3s;
}

.view-all:hover {
  color: var(--el-color-primary-light);
  transform: translateX(3px);
}

/* 图表区域样式 */
.charts-section {
  padding: 30px 0;
  background-color: var(--el-bg-color);
  margin-bottom: 40px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
}

.chart-card {
  transition: all 0.3s ease;
  height: 100%;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.chart-container {
  width: 100%;
  height: 350px;
  padding: 10px;
}

.chart {
  width: 100%;
  height: 100%;
}

.articles-grid,
.travels-grid,
.books-grid {
  display: grid;
  gap: 20px;
}

.articles-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.travels-grid {
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
}

.books-grid {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.article-card,
.travel-card,
.book-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* 卡片悬停动画效果 */
.article-card::after,
.travel-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transition: all 0.6s ease;
}

.article-card:hover,
.travel-card:hover,
.book-card:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
  border-color: var(--el-color-primary-light);
  z-index: 10;
}

.article-card:hover::after,
.travel-card:hover::after {
  left: 100%;
}

.article-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  transition: color 0.3s;
}

.article-card:hover .article-title {
  color: var(--el-color-primary);
}

.loading-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 300px;
  }

  .travels-grid {
    grid-template-columns: 1fr;
  }
}
</style>
