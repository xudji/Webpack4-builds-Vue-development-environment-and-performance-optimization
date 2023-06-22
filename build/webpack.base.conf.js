const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin"); // 需要安装
const HappyPack = require('happypack') // 需要安装
const happyThreaddPool = HappyPack.ThreadPoll({size:3})
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // 需要安装
const TerserPlugin = require("terser-webpack-plugin"); // webpack5内置，不需要再单独安装
const MiniCssExtractPlugin = require("mini-css-extract-plugins")

const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob') // 文件匹配模式

const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 需要安装
const smp = new SpeedMeasurePlugin();

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 需要安装
/* 
module.exports = () => smp.wrap(config) // 使用smp包裹webpack的配置
*/

module.exports = {
  optimization:{
    usedExports: true,
    minimizer:{
      new UglifyJsPlugin({parallel: true}),
      minimize: true, // 需要开启
      minimizer: [
        // 添加 css 压缩配置
        new CssMinimizerPlugin({}), // 需要压缩
        new UglifyJsPlugin({}), // 压缩js
        new TerserPlugin({}), // 压缩js
      ]
    },
    splitChunks: {
      chunks: 'async', // 值有 
      miniSize: 20000, // 生成的chunk的最小体积
      minRemainingSize: 0,
      minChunks: 1, // 拆分前必须共享模块的最小chunks 数
      maxAsyncRequests: 30, // 按需加载时的最打并行请求数
      maxInitialRequestSize: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\/]node_modules[\/]/,
          priority: -10,
          reuseExistingChunk:true,
        },
        default: {
          miniChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  entry: {
    bundle: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['*', '.js', '.json', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg)$/,
        use:[
          "file-loader",
          {
            loader:"image-webpack-loader",
            options: {
              mozjpeg: {
                processsize: true,
              },
                optipng: {
                  enbled: false
                },
                pngquant: {
                  quality:[0.65, 0.9],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false
                }
            }
          },
        ],
        exclude: /node_modules/, //排除 node_modules 目录
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
          'cache-loader' // 需要安装  
        ]
      },
      {
        test:/.jsx?$/,
        loader:'happypack/loader?id=happyBabel',
      },
      {
        test: /.jsx?$/,
        use:[
          {
            loader: 'thread-loader', // 需要安装
            options: {
              workers: 3 // 进程3个
            }
          },
          {
            loader: 'babel-loader',
            options: {
              // babel-loader 自带
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.less?$/,
        use: [MiniCssExtractPlugin.loader, "css-loader","less-loader"],
        exclude: /node_modules/, // 排除 node_modules 目录
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 动态生成 html 文件
      template: path.resolve(__dirname, '../index.html'),
      minify: {
        // 压缩html
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符号与换行符号
        minifyCSS: true // 压缩内联CSS
      }
    }),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundle to index.html
      debug: true,
      filename: '[name]_[hash].js',
      path: './dll',
      entry: {
        vendor: ['vue', 'vue-router', 'vuex']
      }
    }),
    new VueLoaderPlugin(),
    new webpack.optimize.SplitChunksPlugin(),
    new BundleAnalyzerPlugin({/** 配置 **/}),
    new PurgecssPlugin({
        // 这个我的样式在根目录的index.html里面使用，所以配置这个路径
        paths: glob.sync(`${path.join(__dirname)}/index.html`,{nodir: true})
    }),
    new HappyPack({
      // id 标识 happypack 处理哪一类文件
      id: 'happyBabel',
      // 配置loader
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true'
      }],
      // 共享进程池
      treadPool: happyThreaddPool,
      // 日志输出
      verbose: true
    }),
    new MiniCssExtractPlugin(), // 此插件为每个包含css的js 文件创建了一个单独的css文件 css 代码分割不是以引入了多少个css文件来算，而时根据js包来的
    new CompressionWebpackPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),   
    new BundleAnalyzerPlugin()
  ]
}