var webpack = require('webpack');

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  entry: [
    './src/js/index.js', './src/index.html'
  ],
  output: {
    path: __dirname + '/dist',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, excludes: /node_modules/, loader: 'babel-loader' },
      { test: /\.html$/, loader: 'file?name=[name].[ext]' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url?limit=8192!img' },
      { test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/, loader: 'url' }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    })
  ]
}
