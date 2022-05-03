const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


//const webpack = require('webpack');
module.exports = {
    entry: './src/index.js',
    target:  "web",
    output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist'),
  },
  devtool: 'source-map',
  devServer:{
    //watchFiles: ['src/*.css', 'src/**/*.js', 'src/*.js'],
    port: 3000,
    historyApiFallback: true,
    liveReload: false,
    hot: false,
    headers: {
      "Access-Control-Allow-Credentials": "false", 
      "Access-Control-Allow-Origin": "http://localhost:8083",
  }
  },
  module: {
    rules: [
      {
      test: /\.html$/,
      loader: 'html-loader',
      options: {
        sources: false,
      },
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
        },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          esModule: false,
        },
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
  
  

};