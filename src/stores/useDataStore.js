import { defineStore } from 'pinia'
import profile from '@/data/profile.js'
import articles from '@/data/articles.js'
import travels from '@/data/travels.js'

export const useDataStore = defineStore('data', {
  state: () => ({
    profile: {},
    articles: [],
    books: [],
    travels: []
  }),

  actions: {
    // 加载所有本地数据
    loadAllData() {
      this.profile = profile
      this.articles = articles
      this.books = require('@/data/books.js').default || []
      this.travels = travels
    },

    // 获取单篇文章详情
    getArticleById(id) {
      return this.articles.find((article) => article.id === id)
    },

    // 获取分类文章
    getArticlesByCategory(category) {
      return this.articles.filter((article) => article.category === category)
    },

    // 获取最新文章
    getLatestArticles(limit = 3) {
      return [...this.articles].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit)
    },
    updateArticleViews(id, views) {
      const article = this.articles.find((a) => a.id === id)
      if (article) {
        article.views = views
      }
    },

    // 更新文章点赞数
    updateArticleLikes(id, likes) {
      const article = this.articles.find((a) => a.id === id)
      if (article) {
        article.likes = likes
      }
    },

    // 更新文章评论
    updateArticleComments(id, comments) {
      const article = this.articles.find((a) => a.id === id)
      if (article) {
        article.comments = comments
      }
    },

    // 获取热门文章
    getPopularArticles(limit = 5) {
      // 简单实现：按阅读量排序
      return [...this.articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit)
    },

    // 获取相关文章
    getRelatedArticles(tags, currentId, limit = 3) {
      if (!tags || tags.length === 0) return []

      // 找到有共同标签的文章
      return [...this.articles]
        .filter((a) => a.id !== currentId && a.tags.some((tag) => tags.includes(tag)))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit)
    }
  },

  getters: {
    // 按年份归档文章
    articlesByYear() {
      const yearMap = {}
      this.articles.forEach((article) => {
        const year = new Date(article.date).getFullYear()
        if (!yearMap[year]) {
          yearMap[year] = []
        }
        yearMap[year].push(article)
      })
      return yearMap
    },

    // 获取所有分类
    allCategories() {
      const categories = new Set()
      this.articles.forEach((article) => {
        categories.add(article.category)
      })
      return Array.from(categories)
    },

    // 统计各分类文章数量
    categoryCount() {
      const countMap = {}
      this.articles.forEach((article) => {
        countMap[article.category] = (countMap[article.category] || 0) + 1
      })
      return countMap
    }
  }
})
