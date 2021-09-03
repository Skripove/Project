const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env = {}) => ({
  // context: path.resolve(__dirname, "src"),
  mode: env.production ? "production" : "development",
  entry: "./src//index.tsx",
  output: {
    filename: env.production ? "js/[name].[contenthash].js" : "js/[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css", ".svg", ".ico", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options:{
              publicPath: "../",
            }
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: "./assets/favicon.ico",
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
    open: false,
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