const webpack = require("webpack");
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '' : process.env.NODE_ENV === 'dev_test' ? '/test' : `/${process.env.NODE_ENV}`,
  // publicPath: process.env.NODE_ENV === 'production' ? '' : `/${process.env.NODE_ENV}`,
  publicPath: "/multiplatform-app",
  outputDir: `multiplatform-web`,
  lintOnSave: true,
  productionSourceMap: !process.env.NODE_ENV === "production", // 正式环境打包不生成mapsource
  devServer: {
    port: 30003,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@api", resolve("src/api"))
      .set("@pagesPublic", resolve("src/pages/publicPages"))
      .set("@pagesSystem", resolve("src/pages/systemPages"))
      .set("@pagesStatic", resolve("src/pages/static"))
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
