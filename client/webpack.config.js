const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";

const filename = (ext) =>
  isProd ? `[name].[contenthash].${ext}` : `[name].bundle.${ext}`;

const plugins = () => {
  const basePlugins = [
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
      chunkFilename: isProd ? "[id].[contenthash].css" : "[id].bundle.css",
    }),
  ];

  if (isProd) {
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
                    name: "preset-default",
                    params: {
                      overrides: {
                        builtinPluginName: {
                          optionName: "optionValue",
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
    );
  }

  return basePlugins;
};

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `js/${filename("js")}`,
    assetModuleFilename: "assets/[hash][ext][query]",
    clean: true,
  },
  mode: isProd ? "production" : "development",
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "assets"),
    },
    extensions: [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".scss",
      ".css",
      ".svg",
      ".ico",
      ".json",
    ],
  },
  devtool: isProd ? false : "source-map",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isProd
            ? {
                loader: MiniCssExtractPlugin.loader,
              }
            : "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
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
    open: true,
    compress: true,
    port: 9000,
    hot: true,
    // proxy: {
    //   '/api/**': {
    //     target: 'http://localhost:8080',
    //   }
    // },
  },
};
