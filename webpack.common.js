/* eslint-disable unicorn/prefer-module */
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 单独打包css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // 压缩css
const TerserPlugin = require('terser-webpack-plugin') // js压缩

const getCssLoaders = (importLoaders, isDev) => [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: false,
      sourceMap: isDev,
      importLoaders,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        ident: 'postcss',
        plugins: [
          require('postcss-preset-env')({
            autoprefixer: {
              grid: true,
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          require('postcss-normalize'),
        ],
      },
      sourceMap: isDev,
    },
  },
]

const getPluginsByIsDev = (isDev) =>
  isDev
    ? []
    : [
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css',
          chunkFilename: 'css/[name].[contenthash].css',
          ignoreOrder: false,
        }),
      ]

module.exports = (isDev, PROJECT_PATH) => ({
  stats: isDev ? 'errors-only' : 'normal', // https://webpack.js.org/configuration/stats/ 打包的一些信息
  cache: isDev
    ? {
        type: 'memory',
      }
    : {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      }, // webpack5 缓存机制
  infrastructureLogging: {
    // Only warnings and errors
    // level: 'none' disable logging
    // Please read https://webpack.js.org/configuration/other-options/#infrastructurelogginglevel
    level: 'warn',
  },
  entry: {
    app: path.resolve(PROJECT_PATH, './src/index.jsx'),
  },
  output: {
    filename: `js/[name]${isDev ? '' : '.[contenthash]'}.js`,
    path: path.resolve(PROJECT_PATH, './dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      Src: path.resolve(PROJECT_PATH, './src'),
      Components: path.resolve(PROJECT_PATH, './src/components'),
      Utils: path.resolve(PROJECT_PATH, './src/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true, rootMode: 'upward' },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: getCssLoaders(1, isDev),
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(2, isDev),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      /*
      Webpack5.0新增资源模块(asset module)，它是一种模块类型，允许使用资源文件（字体，图标等）而无需     配置额外 loader。支持以下四个配置
      asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
      asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
      asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
      asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资     源体积限制实现。
    */
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: 'images/[name][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, //超过10kb不转base64
          },
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        type: 'asset/resource',
        generator: {
          // 输出文件位置以及文件名
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_PATH, './public/index.html'),
      title: 'monorepo demo',
      filename: 'index.html',
      cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
      inject: 'body',
      minify: isDev
        ? false
        : {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            useShortDoctype: true,
          },
    }),
    new webpack.ids.DeterministicModuleIdsPlugin({
      maxLength: 5,
    }),
    ...getPluginsByIsDev(isDev),
  ],
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // },
  optimization: {
    minimize: !isDev,
    minimizer: !isDev
      ? [
          new TerserPlugin({
            extractComments: false,
            terserOptions: {
              compress: { pure_funcs: ['console.log'] },
            },
          }),
          new CssMinimizerPlugin(),
        ]
      : [],
    moduleIds: false, // 配合 DeterministicModuleIdsPlugin 优化
    // webpack 官方推荐配置
    splitChunks: {
      chunks: 'async',
      minSize: 20_000,
      cacheGroups: {
        defaultVendors: {
          test: /[/\\]node_modules[/\\]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
          priority: 20,
        },
      },
    },
  },
})
