import { defineStore } from 'pinia'
import profile from '@/data/profile'
import articles from '@/data/articles'
// import books from '@/data/books'
import travels from '@/data/travels'

// 定义数据Store
export const useDataStore = defineStore('data', {
  state: () => ({
    profile: {}, // 个人信息
    articles: [], // 博客文章
    books: [], // 书单
    travels: [] // 旅行日记
  }),
  actions: {
    // 加载所有本地数据
    loadAllData() {
      this.profile = profile
      this.articles = articles
      this.books = require('@/data/books.js').default || []
      this.travels = travels
    },
    // 根据ID获取单篇文章
    getArticleById(id) {
      return this.articles.find((article) => article.id === id)
    },
    // 搜索功能（匹配标题、内容、标签）
    searchContent(keyword) {
      if (!keyword) return []
      const lowerKeyword = keyword.toLowerCase()

      // 搜索范围：文章、旅行日记、书籍
      const results = [
        ...this.articles.map((item) => ({ ...item, type: '文章' })),
        ...this.travels.map((item) => ({ ...item, type: '旅行日记' })),
        ...this.books.map((item) => ({ ...item, type: '书籍' }))
      ].filter((item) => {
        // 匹配标题、内容或标签
        const matchTitle = item.title.toLowerCase().includes(lowerKeyword)
        const matchContent = item.content?.toLowerCase().includes(lowerKeyword)
        const matchTags = item.tags?.some((tag) => tag.toLowerCase().includes(lowerKeyword))
        return matchTitle || matchContent || matchTags
      })

      return results
    }
  }
})
