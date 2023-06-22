# Webpack4-builds-Vue-development-environment-and-performance-optimization
## 基于 Webpack4 搭建 Vue 开发环境

#### 初始化项目

`mkdir Webpack-Vue && cd Webpack-Vue && npm init -y`

#### 安装 Webpack 

`npm i webpack webpack-cli -D`

#### 配置最基本的 Webpack

`cd build/ && touch webpack.base.conf.js webpack.dev.conf.js webpack.prod.conf.js build.js`

#### npm scripts

`"build": "node build/build.js",`
`"dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js"`

#### 引入一些基础的 Loader

   `1.babel-loaderbabel-loader`

   `2.file-loader`

   `3.vue-loader`

#### 优化 CSS 代码

`npm i postcss-loader autoprefixer -D`

#### 开启热更新

 `new webpack.HotModuleReplacementPlugin()`

 `if (module.hot) {  module.hot.accept(); }`

#### 第三方库单独打包

`npm i autodll-webpack-plugin -D`

#### 提取共同代码

`new webpack.optimize.SplitChunksPlugin()`

#### 抽取 CSS 到单文件

`npm **i** mini-css-extract-plugin -D`

## 优化构建速度和优化构建结果

1. 对于 **优化构建速度** 从 `定向查找`、`减少执行构建的模块`、`并行构建以提升总体速度`、`并行压缩提高构建效率`、`合理使用缓存`
2. 对于 **优化构建结果** 从 `压缩代码`、`按需加载`、`提前加载`、`Code Splitting`、`Tree Shaking`、`Gzip`、`作用提升`几个方面入手

