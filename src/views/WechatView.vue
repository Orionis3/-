<!-- src/views/WechatView.vue -->
<template>
  <div class="wechat-container">
    <el-page-header @back="handleBack" content="微信公众号" />
    <div class="qrcode-wrapper">
      <img :src="wechatQrcode" alt="微信公众号二维码" class="qrcode-img" />
      <p class="qrcode-desc">扫码关注我的公众号，获取更多内容</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/useDataStore'

const router = useRouter()
const dataStore = useDataStore()
// 获取微信图片路径
const wechatQrcode = ref(dataStore.profile.contact.wechat)

// 返回上一页
const handleBack = () => {
  router.back()
}
</script>

<style scoped>
.wechat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.qrcode-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

.qrcode-img {
  width: 300px;
  height: 300px;
  object-fit: contain;
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.qrcode-desc {
  margin-top: 20px;
  font-size: 16px;
  color: var(--el-text-color-primary);
}
</style>
