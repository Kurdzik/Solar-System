const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//let LiveReloadPlugin = require('webpack-livereload-plugin');
const path = require('path');

new webpack.ProvidePlugin({
        CANNON: 'cannon'
    }),

    module.exports =  {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname,'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    modules: [path.resolve(__dirname, '/src'), 'node_modules/'],
    descriptionFiles: ['package.json'],
    extensions : ['.js']
  },
  plugins: [ 
      new HtmlWebpackPlugin({ template: 'index.html' }),
    //new LiveReloadPlugin() //for live asset reloading
  ]
};

