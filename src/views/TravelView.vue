<template>
  <div class="travel-container">
    <el-page-header @back="handleBack" content="旅行日记" />

    <!-- 筛选区 -->
    <div class="filter-bar">
      <el-select
        v-model="selectedLocation"
        placeholder="选择地点"
        size="small"
        class="filter-select"
        @change="handleFilterChange"
      >
        <el-option label="全部地点" value="" />
        <el-option v-for="loc in allLocations" :key="loc" :label="loc" :value="loc" />
      </el-select>

      <el-select
        v-model="selectedYear"
        placeholder="选择年份"
        size="small"
        class="filter-select"
        @change="handleFilterChange"
      >
        <el-option label="全部年份" value="" />
        <el-option v-for="year in allYears" :key="year" :label="year" :value="year" />
      </el-select>
    </div>

    <!-- 日记列表 -->
    <div class="travel-grid">
      <el-card
        v-for="travel in filteredTravels"
        :key="travel.id"
        class="travel-card"
        @click="$router.push(`/travel/${travel.id}`)"
      >
        <div class="travel-header">
          <img :src="travel.coverImage" :alt="travel.title" class="travel-cover" />
          <div class="travel-info">
            <h3>{{ travel.title }}</h3>
            <div class="travel-meta">
              <span
                ><el-icon><MapLocation /></el-icon> {{ travel.location }}</span
              >
              <span
                ><el-icon><Calendar /></el-icon> {{ travel.date }}</span
              >
            </div>
          </div>
        </div>
        <div class="travel-content">
          <p>{{ travel.summary }}</p>
          <el-button type="text" size="small" class="read-more">
            阅读全文 <el-icon><Right /></el-icon>
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <el-empty v-if="filteredTravels.length === 0" description="暂无旅行记录" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import { MapLocation, Calendar, Right } from '@element-plus/icons-vue'

const router = useRouter()
const dataStore = useDataStore()

// 所有旅行日记
const travels = computed(() => dataStore.travels)

// 筛选条件
const selectedLocation = ref('')
const selectedYear = ref('')

// 提取所有地点和年份
const allLocations = computed(() => {
  const locations = new Set()
  travels.value.forEach((travel) => locations.add(travel.location))
  return Array.from(locations)
})

const allYears = computed(() => {
  const years = new Set()
  travels.value.forEach((travel) => {
    const year = new Date(travel.date).getFullYear()
    years.add(year)
  })
  return Array.from(years).sort((a, b) => b - a) // 倒序排列
})

// 筛选后的日记
const filteredTravels = computed(() => {
  return travels.value
    .filter((travel) => {
      // 地点筛选
      const locationMatch = !selectedLocation.value || travel.location === selectedLocation.value

      // 年份筛选
      const yearMatch =
        !selectedYear.value || new Date(travel.date).getFullYear() === Number(selectedYear.value)

      return locationMatch && yearMatch
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // 最新的在前
})

// 处理返回
const handleBack = () => {
  router.back()
}

// 处理筛选条件变化
const handleFilterChange = () => {
  // 筛选逻辑在computed中自动处理
}
</script>

<style scoped>
.travel-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-bar {
  display: flex;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color);
}

.filter-select {
  width: 180px;
}

.travel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.travel-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.travel-card:hover {
  transform: translateY(-5px);
}

.travel-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.travel-cover {
  width: 120px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.travel-info {
  flex: 1;
}

.travel-info h3 {
  margin-bottom: 10px;
  font-size: 16px;
}

.travel-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.travel-content p {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}

.read-more {
  padding: 0;
}
</style>
