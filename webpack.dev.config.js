const webpack = require('webpack')
const merge = require('webpack-merge')

const webpackBaseConfig = require('./webpack.base.config')

const baseUrl = "http://bzsite.test.proxima-ai.com"; //"http://113.31.113.34/"; //

module.exports = merge(webpackBaseConfig, {
  devtool: 'eval-source-map',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].min.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    publicPath: '/',
    // host: '127.0.0.1',
    // open:true,
    port: 8087,
    disableHostCheck: true, // 默认不检查hostname
    //服务器代理配置项
    proxy: {
      '/aaa': {
        // http://anno.proxima-ai.com/aaa
        // target: 'http://172.16.104.70:18151',
        target: baseUrl + '/aaa',
        secure: false,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/aaa': '' // 和开发联调需要配置
        // }
      },
      '/proxyImg': {
        target: baseUrl,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/proxyImg': ''
        }
      },
      '/search': {
        target: baseUrl,
        secure: false,
        changeOrigin: true
      },
      '/config': {
        target: baseUrl,
        secure: false,
        changeOrigin: true
      }
    }
  }
})
