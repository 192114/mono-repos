const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const common = require('../../webpack.common')

const SERVER_HOST = null
const SERVER_PORT = null

const PROJECT_PATH = path.resolve(__dirname)

module.exports = merge(common(true, PROJECT_PATH), {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: SERVER_HOST, // 指定 host，不设置的话默认是 localhost
    port: SERVER_PORT, // 指定端口，默认是8080
    compress: true, // 是否启用 gzip 压缩
    open: true, // 打开默认浏览器
    hot: true, // 热更新
    proxy: {
      '/commapk': {
        target: 'https://www.yuge.com',
        changeOrigin: true,
      },
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
})
