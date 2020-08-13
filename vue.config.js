// gzip --start
// const CompressionWebpackPlugin = require("compression-webpack-plugin");
// const productionGzip = true; // 是否使用gzip
// const productionGzipExtensions = ["js", "css"]; // 需要gzip压缩的文件后缀

module.exports = {
  publicPath: "/",
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    https: false,
    hotOnly: false, // 热更新
    proxy: null, // 设置代理
    open: true
  }
};
