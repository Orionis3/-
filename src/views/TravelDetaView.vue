<template>
  <div class="travel-detail-container">
    <!-- 返回按钮 -->
    <el-page-header @back="handleBack" :content="travel?.title || '旅行详情'" />

    <!-- 加载状态 -->
    <el-skeleton v-if="loading" class="skeleton-container">
      <el-skeleton-item variant="image" style="height: 300px" />
      <el-skeleton-item variant="text" style="width: 50%; margin-top: 20px" />
      <el-skeleton-item variant="text" style="width: 30%; margin-top: 10px" />
      <el-skeleton-item variant="text" style="width: 100%; margin-top: 20px" />
      <el-skeleton-item variant="text" style="width: 100%" />
      <el-skeleton-item variant="text" style="width: 80%" />
    </el-skeleton>

    <!-- 内容区域 -->
    <div v-else-if="travel" class="travel-content">
      <!-- 封面图 -->
      <div class="cover-wrapper">
        <img :src="travel.coverImage || defaultCover" :alt="travel.title" class="travel-cover" />
        <div class="cover-overlay">
          <div class="cover-title">{{ travel.title }}</div>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="travel-meta">
        <div class="location-date">
          <span class="meta-item"
            ><el-icon><MapLocation /></el-icon> {{ travel.location }}</span
          >
          <span class="meta-item"
            ><el-icon><Calendar /></el-icon> {{ formatDate(travel.date) }}</span
          >
        </div>
      </div>

      <!-- 正文内容 -->
      <div class="travel-body">
        <div class="travel-description" v-html="travel.content"></div>

        <!-- 旅行照片集 -->
        <div v-if="travel.photos && travel.photos.length" class="photo-gallery">
          <h3 class="gallery-title">旅行照片</h3>
          <div class="photos-grid">
            <img
              v-for="(photo, idx) in travel.photos"
              :key="idx"
              :src="photo"
              :alt="`${travel.title}的照片${idx + 1}`"
              class="gallery-img"
              @click="openPhotoViewer(photo, travel.photos, idx)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 数据不存在 -->
    <el-empty v-else description="未找到该旅行记录" />

    <!-- 照片查看器 -->
    <div v-if="photoViewerVisible" class="photo-viewer" @click="closePhotoViewer">
      <div class="viewer-content" @click.stop>
        <el-icon class="viewer-close" @click="closePhotoViewer"><Close /></el-icon>
        <img :src="currentPhoto" class="viewer-img" />
        <div class="viewer-nav">
          <el-button
            icon="ArrowLeft"
            size="small"
            @click.stop="prevPhoto"
            :disabled="currentPhotoIndex === 0"
          />
          <span class="viewer-counter">{{ currentPhotoIndex + 1 }} / {{ allPhotos.length }}</span>
          <el-button
            icon="ArrowRight"
            size="small"
            @click.stop="nextPhoto"
            :disabled="currentPhotoIndex === allPhotos.length - 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'
import { MapLocation, Calendar, Close } from '@element-plus/icons-vue'

// 路由和状态管理
const route = useRoute()
const router = useRouter()
const dataStore = useDataStore()

// 状态变量
const travel = ref(null)
const loading = ref(true)
const defaultCover = 'https://picsum.photos/1200/400?grayscale' // 默认封面图
const photoViewerVisible = ref(false)
const currentPhoto = ref('')
const currentPhotoIndex = ref(0)
const allPhotos = ref([])

// 获取旅行ID
const travelId = computed(() => {
  return Number(route.params.id) // 从路由参数中获取ID
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取旅行详情
const getTravelDetail = () => {
  loading.value = true
  // 从数据仓库中查找对应ID的旅行记录
  const found = dataStore.travels.find((item) => item.id === travelId.value)

  if (found) {
    travel.value = found
  } else {
    travel.value = null
  }
  loading.value = false
}

// 照片查看器控制
const openPhotoViewer = (photo, photos, index) => {
  currentPhoto.value = photo
  allPhotos.value = photos
  currentPhotoIndex.value = index
  photoViewerVisible.value = true
  document.body.style.overflow = 'hidden' // 防止背景滚动
}

const closePhotoViewer = () => {
  photoViewerVisible.value = false
  document.body.style.overflow = '' // 恢复滚动
}

const prevPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
    currentPhoto.value = allPhotos.value[currentPhotoIndex.value]
  }
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < allPhotos.value.length - 1) {
    currentPhotoIndex.value++
    currentPhoto.value = allPhotos.value[currentPhotoIndex.value]
  }
}

// 页面加载时获取数据
onMounted(() => {
  getTravelDetail()
})

// 处理返回
const handleBack = () => {
  router.back()
}
</script>

<style scoped>
.travel-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.skeleton-container {
  padding: 20px 0;
}

/* 封面图样式优化 */
.cover-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.travel-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 8s ease;
}

.cover-wrapper:hover .travel-cover {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.cover-title {
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 元数据样式 */
.travel-meta {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--el-border-color);
}

.location-date {
  display: flex;
  gap: 25px;
  color: var(--el-text-color-secondary);
  font-size: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s;
}

.meta-item:hover {
  color: var(--el-color-primary);
}

/* 正文内容样式 */
.travel-body {
  line-height: 1.8;
  font-size: 16px;
  color: var(--el-text-color-regular);
  padding: 0 5px;
}

.travel-description p {
  margin-bottom: 20px;
  text-align: justify;
}

.travel-description p:first-letter {
  margin-left: 2em;
}

/* 照片集样式 */
.photo-gallery {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px dashed var(--el-border-color);
}

.gallery-title {
  margin-bottom: 20px;
  font-size: 20px;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.gallery-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 20px;
  background-color: var(--el-color-primary);
  border-radius: 2px;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.gallery-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gallery-img:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

/* 照片查看器样式 */
.photo-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.viewer-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.viewer-img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
}

.viewer-close {
  position: absolute;
  top: -40px;
  right: -40px;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;
}

.viewer-close:hover {
  transform: scale(1.2);
}

.viewer-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.viewer-counter {
  color: white;
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .travel-detail-container {
    padding: 15px;
  }

  .cover-wrapper {
    height: 250px;
  }

  .cover-title {
    font-size: 22px;
  }

  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .gallery-img {
    height: 130px;
  }

  .viewer-close {
    right: 0;
    top: -30px;
  }
}
.el-page-header {
  margin-bottom: 30px;
}
</style>
