const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    main: './js/main.js',
    dashboard: './js/dashboard.js'
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist/js'),
    clean: true,
    publicPath: '/dist/js/'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        }
      },
      extractComments: false
    })],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false
}; 