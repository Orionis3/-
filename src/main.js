import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia' // 引入Pinia
import ElementPlus from 'element-plus' // 引入Element Plus
import 'element-plus/dist/index.css' // Element Plus样式
import * as Icons from '@element-plus/icons-vue' // 引入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 1. 创建Pinia实例
const pinia = createPinia()

// 2. 创建Vue实例
const app = createApp(App)

// 3. 全局注册Element Plus图标（方便在模板中直接使用）
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}
// 注册所有图标（或按需注册需要的图标）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 4. 挂载所有工具
app.use(pinia)

app.use(router)
app.use(ElementPlus)

// 5. 挂载应用
app.mount('#app')
