const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
  entry: ['babel-polyfill', './src/client/index.jsx'],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      test: /\.(sc|c|sa)ss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        { loader: 'scoped-css-loader' },
      ],
    },
    {
      test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
      loader: 'file-loader'
    }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    openPage: 'http://localhost:3000',
    hot: true,
    historyApiFallback: true,
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.svg'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/manifest.json', to: 'manifest.json' },
        { from: 'public/*.png', to: '[name].[ext]' },
      ],
    }),
    new GenerateSW({
      maximumFileSizeToCacheInBytes: 30 * 1024 * 1024
    })
  ]
};
