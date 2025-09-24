<template>
  <div class="about-container">
    <el-card class="about-card">
      <div class="about-header">
        <el-avatar :size="100" class="avatar">
          <img :src="profile.avatar" alt="个人头像" />
        </el-avatar>
        <div class="personal-info">
          <h1>{{ profile.name }}</h1>
          <p class="intro">{{ profile.intro }}</p>
          <div class="contact-links">
            <el-link @click="openPhoto" target="_blank" class="weixin-link" />
            <el-link :href="profile.contact.github" target="_blank" class="github-link" />

            <el-link class="contact-link" @click="openEmail"
              ><el-icon><Message /></el-icon
            ></el-link>

            <el-link :href="profile.contact.blog" target="_blank" icon="Link" />
          </div>
        </div>
      </div>

      <div class="about-sections">
        <!-- 个人经历 -->
        <div class="section">
          <h2>
            <el-icon><Briefcase /></el-icon> 个人经历
          </h2>
          <el-timeline>
            <el-timeline-item
              v-for="exp in profile.experience"
              :key="exp.period"
              :timestamp="exp.period"
            >
              <el-card>
                <h3>{{ exp.title }}</h3>
                <p>{{ exp.desc }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 擅长领域 -->
        <div class="section">
          <h2>
            <el-icon><Star /></el-icon> 擅长领域
          </h2>
          <div class="tags">
            <el-tag v-for="skill in profile.skills" :key="skill" type="success" effect="dark">
              {{ skill }}
            </el-tag>
          </div>
        </div>

        <!-- 兴趣爱好 -->
        <div class="section">
          <h2>
            <el-icon><Headset /></el-icon> 兴趣爱好
          </h2>
          <p>{{ profile.hobbies.join(' · ') }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDataStore } from '@/stores/useDataStore'
import { Briefcase, Star, Headset, Message } from '@element-plus/icons-vue'

// 获取个人信息
const dataStore = useDataStore()
const profile = computed(() => dataStore.profile)
const openEmail = () => {
  window.location.href = `mailto:${profile.value.contact.email}`
}
const openPhoto = () => {
  window.location.href = 'http://localhost:8080/wechat'
}
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
}

.about-header {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.personal-info {
  flex: 1;
}

.intro {
  color: var(--el-text-color-secondary);
  margin: 10px 0;
}

.contact-links {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.about-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px dashed var(--el-border-color);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.el-timeline {
  padding-left: 20px;
}
.github-link {
  /* 默认图片 */
  display: inline-block;
  width: 14px; /* 根据实际图片尺寸调整 */
  height: 14px;
  background-image: url('@/components/icons/github-fill.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

.github-link:hover {
  /* hover时的图片 */
  background-image: url('@/components/icons/github-hover.svg'); /* 准备一张hover状态的图片 */
}
.weixin-link {
  /* 默认图片 */
  display: inline-block;
  width: 14px; /* 根据实际图片尺寸调整 */
  height: 14px;
  background-image: url('@/components/icons/weixin.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

.weixin-link:hover {
  /* hover时的图片 */
  background-image: url('@/components/icons/weixin-hover.svg'); /* 准备一张hover状态的图片 */
}
.contact-link {
  position: relative;
  z-index: 10; /* 确保链接在最上层 */
  pointer-events: auto; /* 允许鼠标事件 */
}
</style>
