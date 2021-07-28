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
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset/inline',
        // use: [
        //   {
        //     loader: 'url-loader',
        //     options: {
        //       limit: 10 * 1024,
        //       name: '[name].[contenthash].[ext]',
        //       outputPath: 'assets/images',
        //       publicPath: '../assets/images',
        //     },
        //   },
        // ],
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        type: 'asset/inline',
        // use: [
        //   {
        //     loader: 'url-loader',
        //     options: {
        //       name: '[name].[contenthash].[ext]',
        //       outputPath: 'assets/fonts',
        //       publicPath: '../assets/fonts',
        //     },
        //   },
        // ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_PATH, './templates/index.html'),
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
