import { defineStore } from 'pinia'
import profile from '@/data/profile.js'
import articles from '@/data/articles.js'
import books from '@/data/books.js'
import travels from '@/data/travels.js'

export const useDataStore = defineStore('data', {
  state: () => ({
    profile: null,
    articles: [],
    books: [],
    travels: []
  }),
  actions: {
    // 加载所有本地数据
    loadAllData() {
      this.profile = profile
      this.articles = articles || []
      this.books = books || []
      this.travels = travels || []
    },

    // 根据ID获取文章
    getArticleById(id) {
      return this.articles.find((article) => article.id === id)
    },

    // 获取热门文章
    getPopularArticles(limit = 5) {
      return [...this.articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit)
    },

    // 获取相关文章
    getRelatedArticles(tags = [], excludeId, limit = 2) {
      if (!tags.length) return []
      return this.articles
        .filter(
          (article) => article.id !== excludeId && article.tags.some((tag) => tags.includes(tag))
        )
        .slice(0, limit)
    },

    // 搜索功能实现
    searchContent(keyword) {
      if (!keyword) return []
      const lowerKeyword = keyword.toLowerCase()
      const results = []

      // 搜索文章
      this.articles.forEach((article) => {
        const matches = [
          article.title.toLowerCase().includes(lowerKeyword),
          article.summary?.toLowerCase().includes(lowerKeyword),
          article.content.toLowerCase().includes(lowerKeyword),
          article.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
        ]
        if (matches.some((match) => match)) {
          results.push({ ...article, type: '文章' })
        }
      })

      // 搜索旅行日记
      this.travels.forEach((travel) => {
        const matches = [
          travel.title.toLowerCase().includes(lowerKeyword),
          travel.summary?.toLowerCase().includes(lowerKeyword),
          travel.content?.toLowerCase().includes(lowerKeyword),
          travel.location.toLowerCase().includes(lowerKeyword),
          travel.tags?.some((tag) => tag.toLowerCase().includes(lowerKeyword))
        ]
        if (matches.some((match) => match)) {
          results.push({ ...travel, type: '旅行日记' })
        }
      })

      // 搜索书籍
      this.books.forEach((book) => {
        const matches = [
          book.title.toLowerCase().includes(lowerKeyword),
          book.author.toLowerCase().includes(lowerKeyword),
          book.review?.toLowerCase().includes(lowerKeyword),
          book.notes?.toLowerCase().includes(lowerKeyword),
          book.tags?.some((tag) => tag.toLowerCase().includes(lowerKeyword))
        ]
        if (matches.some((match) => match)) {
          results.push({ ...book, type: '书籍' })
        }
      })

      return results
    }
  }
})
