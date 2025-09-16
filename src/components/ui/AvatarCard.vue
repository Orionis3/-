<template>
  <el-card class="avatar-card" :class="{ 'dark-mode': isDark }">
    <div class="avatar-container">
      <!-- 头像区域 -->
      <el-avatar :size="100" class="avatar-img">
        <img :src="profile.avatar" alt="个人头像" @error="handleAvatarError" />
      </el-avatar>

      <!-- 个人信息区域 -->
      <div class="profile-info">
        <h2 class="name">{{ profile.name }}</h2>
        <p class="intro">{{ profile.intro || '暂无简介' }}</p>

        <!-- 联系方式区域 -->
        <div class="contact-links" v-if="hasContactInfo">
          <el-link
            v-if="profile.contact.github"
            :href="profile.contact.github"
            target="_blank"
            :icon="Github"
            class="contact-link"
            :title="profile.contact.github"
          />
          <el-link
            v-if="profile.contact.email"
            :href="`mailto:${profile.contact.email}`"
            icon="Message"
            class="contact-link"
            :title="profile.contact.email"
          />
        </div>
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { Github } from '@element-plus/icons-vue'
import { defineProps, computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'

// 定义 props 类型
const props = defineProps({
  profile: {
    type: Object,
    required: true,
    default: () => ({
      avatar: '',
      name: '未知用户',
      intro: '',
      contact: {
        github: '',
        email: ''
      }
    }),
    validator: (value) => {
      // 简单验证数据结构
      return 'avatar' in value && 'name' in value && 'contact' in value
    }
  }
})

// 获取全局状态（深色模式）
const appStore = useAppStore()
const isDark = computed(() => appStore.isDark)

// 计算属性：判断是否有联系方式
const hasContactInfo = computed(() => {
  return !!props.profile.contact.github || !!props.profile.contact.email
})

// 头像加载失败处理
const handleAvatarError = (e) => {
  e.target.src = '/default-avatar.png' // 替换为你的默认头像路径
}
</script>

<style scoped>
.avatar-card {
  width: 100%;
  transition: all 0.3s ease;
}

.avatar-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px dashed var(--el-border-color);
}

.avatar-img {
  margin-bottom: 15px;
  border: 3px solid var(--el-color-primary-light-3);
}

.profile-info {
  text-align: center;
  width: 100%;
}

.name {
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.intro {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 15px;
  line-height: 1.5;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.contact-link {
  font-size: 20px;
  color: var(--el-text-color-secondary);
  transition: color 0.2s;
}

.contact-link:hover {
  color: var(--el-color-primary);
}

.hobbies {
  padding: 15px 10px 5px;
}

.hobbies h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}

.hobby-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .avatar-card {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
