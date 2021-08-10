const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env = {}) => ({
  context: path.resolve(__dirname, "src"),
  mode: env.production ? "production" : "development",
  entry: "./index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: env.production ? "js/[name].[contenthash].js" : "js/[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: "../assets/favicon.ico",
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
      minify: {
        collapseWhitespace: env.production,
      },
    }),
    new MiniCssExtractPlugin({
      filename: env.production
        ? "css/[name].[contenthash].css"
        : "css/[name].bundle.css",
      // chunkFilename: env.production ? "[id].[contenthash].css" : "[id].bundle.css"
    }),
  ],
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 9000,
    // hot: true,
    // proxy: {
    //   '/api/**': {
    //     target: 'http://localhost:8080',
    //   }
    // },
  }
});