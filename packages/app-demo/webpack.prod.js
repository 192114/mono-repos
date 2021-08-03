const webpack = require('webpack')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const glob = require('glob')
const PurgeCSSPlugin = require('purgecss-webpack-plugin') // 去除无用的css

const common = require('../../webpack.common')

const PROJECT_PATH = path.resolve(__dirname)

module.exports = merge(common(false, PROJECT_PATH), {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.resolve(PROJECT_PATH, './src')}/**/*`, { nodir: true }),
    }),
    // 添加包注释
    new webpack.BannerPlugin({
      raw: true,
      banner: '/** @preserve Powered by Liar */',
    }),
  ],
})
