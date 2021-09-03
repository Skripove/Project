const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";

const filename = (ext) => isProd ? `[name].[contenthash].${ext}` : `[name].bundle.${ext}`;

const plugins = () => {
  const basePlugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: "./assets/favicon.ico",
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: `css/${filename("css")}`,
      // chunkFilename: isProd ? "[id].[contenthash].css" : "[id].bundle.css"
    }),
  ];

  if(isProd){
    basePlugins.push(
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            [
              "svgo",
              {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        builtinPluginName: {
                          optionName: 'optionValue',
                        },
                        anotherBuiltinPlugin: false,
                      },
                    },
                  },
                ],
              },
            ],
          ],
        },
      })
    )
  }

  return basePlugins;
}

module.exports = {
  mode: "development",
  entry: "./src//index.tsx",
  output: {
    filename: `js/${filename("js")}`,
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css", ".svg", ".ico", ".json"],
    alias: {
      "@app": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "assets"),
    },
  },
  devtool: isProd ? false : "source-map",
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
  plugins: plugins(),
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    minimize: isProd,
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
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
};