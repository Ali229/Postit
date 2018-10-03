const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader', 'angular2-template-loader'],
        exclude: /node_modules/
      },
        {
            // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
            // Removing this will cause deprecation warnings to appear.

            test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
            parser: { system: true },
        },
      {
        test: /\.(html|css)$/,
        loader: 'raw-loader'
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },

  plugins: [
      new webpack.ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)fesm5/, path.join(__dirname, './app')),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      // global app config object
      config: JSON.stringify({
        apiUrl: 'http://localhost:4000'
      })
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true
  },
  devServer: {
    historyApiFallback: true
  }
};