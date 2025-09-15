import { defineStore } from 'pinia'

// 定义应用状态Store
export const useAppStore = defineStore('app', {
  state: () => ({
    isDark: false, // 深色模式开关
    searchKeyword: '' // 搜索关键词
  }),
  actions: {
    // 切换深色模式
    toggleDarkMode() {
      this.isDark = !this.isDark
      // 同步到HTML根元素的class，方便CSS控制样式
      document.documentElement.classList.toggle('dark', this.isDark)
    },
    // 初始化深色模式（跟随系统设置）
    initDarkMode() {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.isDark = prefersDark
      document.documentElement.classList.toggle('dark', prefersDark)
    },
    // 设置搜索关键词
    setSearchKeyword(keyword) {
      this.searchKeyword = keyword
    }
  }
})
