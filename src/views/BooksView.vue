<template>
  <div class="books-container">
    <el-page-header @back="handleBack" content="我的书单" />

    <!-- 标签页：已看完 / 未看完 -->
    <el-tabs v-model="activeTab" type="card" class="books-tabs">
      <el-tab-pane label="已看完" name="finished">
        <div class="books-grid">
          <el-card v-for="book in finishedBooks" :key="book.id" class="book-card">
            <div class="book-info">
              <img :src="book.cover" :alt="book.title" class="book-cover" />
              <div class="book-details">
                <h3>{{ book.title }}</h3>
                <p class="author">作者：{{ book.author }}</p>
                <p class="publisher">出版社：{{ book.publisher }}</p>
                <p class="read-date">阅读时间：{{ book.readDate }}</p>

                <div class="book-tags">
                  <el-tag v-for="tag in book.tags" :key="tag" size="small">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>

            <div class="book-review">
              <h4>阅读心得</h4>
              <p>{{ book.review }}</p>
            </div>
          </el-card>
        </div>

        <el-empty v-if="finishedBooks.length === 0" description="暂无已阅读书籍" />
      </el-tab-pane>

      <el-tab-pane label="未看完" name="unfinished">
        <div class="books-grid">
          <el-card v-for="book in unfinishedBooks" :key="book.id" class="book-card">
            <div class="book-info">
              <img :src="book.cover" :alt="book.title" class="book-cover" />
              <div class="book-details">
                <h3>{{ book.title }}</h3>
                <p class="author">作者：{{ book.author }}</p>
                <p class="publisher">出版社：{{ book.publisher }}</p>

                <el-progress :percentage="book.progress" stroke-width="6" class="reading-progress">
                  <template #format="scope"> 已读 {{ scope.percentage }}% </template>
                </el-progress>

                <div class="book-tags">
                  <el-tag v-for="tag in book.tags" :key="tag" size="small" type="warning">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>

            <div class="book-notes">
              <h4>阅读笔记</h4>
              <p>{{ book.notes || '暂无笔记' }}</p>
            </div>
          </el-card>
        </div>

        <el-empty v-if="unfinishedBooks.length === 0" description="暂无正在阅读的书籍" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'

const router = useRouter()
const dataStore = useDataStore()

// 标签页状态
const activeTab = ref('finished')

// 所有书籍
const books = computed(() => {
  return Array.isArray(dataStore.books) ? dataStore.books : []
})

// 已看完的书籍
const finishedBooks = computed(() => {
  return books.value
    .filter((book) => book.status === 'finished')
    .sort((a, b) => new Date(b.readDate) - new Date(a.readDate))
})

// 未看完的书籍
const unfinishedBooks = computed(() => {
  return books.value
    .filter((book) => book.status === 'unfinished')
    .sort((a, b) => b.progress - a.progress) // 按阅读进度排序
})

// 处理返回
const handleBack = () => {
  router.back()
}
</script>

<style scoped>
.books-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.books-tabs {
  width: 100%;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.book-card {
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-info {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.book-cover {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.book-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.author,
.publisher,
.read-date {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.book-tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.reading-progress {
  margin: 10px 0;
  width: 200px;
}

.book-review,
.book-notes {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--el-border-color);
}

.book-review h4,
.book-notes h4 {
  margin-bottom: 8px;
  font-size: 14px;
}

.book-review p,
.book-notes p {
  font-size: 13px;
  line-height: 1.6;
}
</style>
