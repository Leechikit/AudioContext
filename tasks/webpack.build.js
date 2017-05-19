var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var config = require('../config').default;
var publicPath = config.publicPath+'project/tasksystem/pc/';

module.exports = {
    //插件项
    plugins: [
        //生成独立样式文件
        new ExtractTextPlugin("css/[name].bundle.css"),
        //压缩js
        /*new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,
            },
            compress: {
                warnings: false
            }
        })*/
    ],
    //devtool: 'source-map', 
    //页面入口文件配置
    entry: getEntry(),
    //入口文件输出配置
    output: {
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].js',
        publicPath: publicPath
    },
    module: {
        //加载器配置
        loaders: [{
            test: /\.css$/,
            loader: 'style!css'
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!postcss!sass')
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url?limit=8192&name=image/[name].[ext]?[hash]'
        }, {
            test: /\.(html)$/,
            loader: 'html?attrs=img:src img:data-original!file?name=html/[name].[ext]'
        }, {
            test:/\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
              presets: ['es2015','stage-0'],
              plugins: ['transform-runtime']
            }
        }]
    },
    //其它解决方案配置
    resolve: {
        root: '', //绝对路径
        extensions: ['', '.js', '.json', '.scss'],
        alias: config.alias
    },
    externals: config.global,
    recordsPath: path.join(__dirname, "webpack.records.json")
};

function getEntry() {
    var jsPath = path.resolve('src');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [],
        files = {};
    dirs.forEach(function(item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve('src', item);
        }
    });
    return files;
}