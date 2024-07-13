const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const resolve = (dir) => path.resolve(__dirname, dir);
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin")
module.exports = {
  outputDir: `front-frame`,
  lintOnSave: true,
  productionSourceMap: true, // 正式环境打包不生成mapsource
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "@/assets/css/additionalData.scss";'
      }
    }
  },
  devServer: {
    port: 30000,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    // proxy: {
    //   '/api': {
    //     target: 'http://e.dxy.net', // 后台接口域名
    //     ws: true, //如果要代理 websockets，配置这个参数
    //     secure: false, // 如果是https接口，需要配置这个参数
    //     changeOrigin: true, //是否跨域
    //   }
    // }
  },
  chainWebpack: (config) => {
    // 资源变量配置
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@api", resolve("src/api"))
      .set("@pagesPublic", resolve("src/pages/public"))
      .set("@pagesSystem", resolve("src/pages/system"))
      .set("@img", resolve("src/assets/img"))
      .set("@icon", resolve("src/assets/icon"))
      .set("@mixins", resolve("src/mixins"))
      .set("@common", resolve("src/utils/common"))
      .set("@config", resolve("src/config"))
      .set("vue-i18n", "vue-i18n/dist/vue-i18n.cjs.js");

    if (process.env.NODE_ENV === "production") {
      config.plugin("compressionPlugin").use(
        new CompressionPlugin({
          test: /\.css$|\.html$|\.js/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false, // 不删除源文件
        })
      );
    }
    // 移除 prefetch 插件（解决首次进入页面所有资源预加载）
    config.plugins.delete("prefetch");
  },
  configureWebpack: {
    plugins: [
      // 合并较小的chunk.js
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 10,
        minChunkSize: 10240,
      }),
    ],
    optimization: {
      runtimeChunk: "single",
      minimizer: [
        new UglifyjsWebpackPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,  //去掉debugger
              drop_console: true,  // 去掉console
              pure_funcs: ['console.log']// 移除console
            }
          },
          sourceMap: true
        }),
      ],
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 10240, // 依赖包超过10240bit将被单独打包
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
  },
};
