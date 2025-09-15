const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

// vue.config.js（如果没有则新建）
module.exports = {
  devServer: {
    client: {
      // 关闭错误浮层（overlay）：true 显示，false 关闭
      overlay: false
    }
  }
  // 你的其他配置（如 publicPath、plugins 等）
}
