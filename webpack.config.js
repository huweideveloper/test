const webpack = require('webpack')
const merge = require('webpack-merge')
// const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpackBaseConfig = require('./webpack.base.config')

module.exports = merge(webpackBaseConfig, {
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].min.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production') // 咱们程序中没用到，不仅能控制Vue所运行的模式，同时可以让UglifyJS之类的压缩工具完全丢掉仅供开发环境的代码块，以减少最终的文件尺寸(因为Vue官方提供的CommonJS和ES Module版本是用于打包工具的，并没有提供压缩后的版本，需要自行将最终的包进行压缩)
    }),
    new CleanWebpackPlugin(),
    new UglifyJsPlugin(),
    // new ParallelUglifyPlugin({
    //   cacheDir: '.cache/',
    //   uglifyJS: {
    //     output: {
    //       beautify: false,
    //       comments: false
    //     },
    //     compress: {
    //       drop_console: true
    //     },
    //     warnings: false
    //   }
    // })
  ]
})
