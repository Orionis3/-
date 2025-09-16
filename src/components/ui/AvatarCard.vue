<template>
  <el-card class="avatar-card">
    <div class="avatar-container">
      <el-avatar class="avatar-img" :size="100">
        <img src="@/assets/images/avatar.jpg" alt="个人头像" />
      </el-avatar>
      <h3 class="avatar-name">{{ profile.name }}</h3>
      <p class="avatar-title">{{ profile.title }}</p>
    </div>

    <div class="avatar-bio">{{ profile.bio }}</div>

    <div class="avatar-links">
      <el-link
        v-for="(link, key) in profile.links"
        :key="key"
        :href="link.url"
        :icon="getLinkIcon(link.type)"
        target="_blank"
        :underline="false"
        class="link-item"
      />
    </div>
  </el-card>
</template>

<script setup>
import { Github, Twitter, Mail, Link } from '@element-plus/icons-vue'
import { defineProps, computed } from 'vue'

// 定义 props
const props = defineProps({
  profile: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      title: '',
      bio: '',
      links: []
    })
  }
})

// 使用 computed 保持响应式，避免直接解构 props
const profile = computed(() => props.profile)

// 图标映射
const iconMap = {
  github: Github,
  twitter: Twitter,
  mail: Mail,
  link: Link
}

// 处理链接图标
const getLinkIcon = (type) => {
  return iconMap[type] || Link
}
</script>

<style scoped>
.avatar-card {
  text-align: center;
  padding: 20px 15px;
  width: 280px;
}

.avatar-container {
  margin-bottom: 15px;
}

.avatar-img {
  margin: 0 auto 10px;
  border: 3px solid var(--el-color-primary-light-3);
  transition: transform 0.3s ease;
}

.avatar-img:hover {
  transform: scale(1.05);
}

.avatar-name {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
}

.avatar-title {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.avatar-bio {
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  margin-bottom: 15px;
  padding: 0 5px;
}

.avatar-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.link-item {
  font-size: 20px;
  color: var(--el-text-color-secondary);
  transition: all 0.2s;
}

.link-item:hover {
  color: var(--el-color-primary);
  transform: translateY(-3px);
}

/* 深色模式适配 */
:deep(.dark) .avatar-card {
  --el-card-bg-color: #1a1a1a;
}

:deep(.dark) .avatar-img {
  border-color: var(--el-color-primary-dark-3);
}
</style>
