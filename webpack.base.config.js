const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const htmlPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const outputDir = 'dev'

const plugins = [
  new VueLoaderPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    filename: 'common.[hash].js',
    chunks: ['main'] // 指定source chunk，即指定从哪些chunk当中去找公共模块，省略该选项的时候，默认就是entry chunks(此时页面中引入这几个js的顺序是: common->main->vendor，会报错，vendor应该最先引入)
  }),
  new webpack.LoaderOptionsPlugin({
    debug: true,
    babel: {
      babelrc: false,
      presets: ['es2015']
    }
  }),
  new webpack.DefinePlugin({
    'process.env.APP_ENV': process.env.APP_ENV ? JSON.stringify(process.env.APP_ENV) : '"zj"' // 这里获取项目配置, 默认zj
  }),
  new ExtractTextPlugin('css/[name].[contenthash].css'),
  new CopyWebpackPlugin([
    { from: path.resolve(__dirname, './libs'), to: path.resolve(__dirname, `./${outputDir}/libs`) },
    { from: path.resolve(__dirname, './images'), to: path.resolve(__dirname, `./${outputDir}/images`) },
    { from: path.resolve(__dirname, './dist'), to: path.resolve(__dirname, `./${outputDir}/dist`) },
    { from: path.resolve(__dirname, './biaozhu_iconfont'), to: path.resolve(__dirname, `./${outputDir}/biaozhu_iconfont`) },
    { from: path.resolve(__dirname, './set.js'), to: path.resolve(__dirname, `./${outputDir}`) },
    { from: path.resolve(__dirname, './language_v1.0.json'), to: path.resolve(__dirname, `./${outputDir}`) }
  ]),
  new htmlPlugin({
    template: './index.html',
    filename: 'index.html',
    title: 'Proxima'
    // hash: true
  })
]

const entry = {
  main: path.resolve(__dirname, './app/main.js'),
  vendor: [
    './app/libs/drawsvg/raphael',
    './app/utils/Metix',
    './app/utils/md5',
    './app/utils/base64',
    './app/utils/event',
    './app/utils/tool',
    './app/utils/es6',
    './app/utils/animation',
    './app/base/es6pagebase',
    './app/base/es6modulesbase',
    './app/base/es6modalbase',
    './app/base/es6modelbase'
  ]
}

module.exports = {
  entry,
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, `./${outputDir}/`)
  },
  plugins,
  externals: {
    raphael: './app/libs/drawsvg/raphael.min'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve('app'),
      '@utils': path.resolve('app/utils')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        //loader: 'babel-loader'
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['stage-0'], ['es2015', { modules: false }]]
            }
          }
        ]
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'less-loader'
            }
          ]
        })
      },
      {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader'
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  }
}
