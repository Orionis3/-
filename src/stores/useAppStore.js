import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isDark: false,
    isMenuCollapsed: false,
    searchKeyword: ''
  }),
  actions: {
    // 初始化主题模式（从本地存储读取）
    initDarkMode() {
      const savedMode = localStorage.getItem('isDark')
      this.isDark = savedMode === 'true'
      // 应用主题
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    // 切换深色/浅色模式
    toggleDarkMode() {
      this.isDark = !this.isDark
      // 更新HTML根元素类名
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      // 保存状态到本地存储
      localStorage.setItem('isDark', this.isDark)
    },

    // 切换菜单折叠状态
    toggleMenu() {
      this.isMenuCollapsed = !this.isMenuCollapsed
    },

    // 设置搜索关键词
    setSearchKeyword(keyword) {
      this.searchKeyword = keyword
    }
  }
})
