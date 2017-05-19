var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var config = require('../config').default;
var host = '127.0.0.1';
var port = config.port;
var publicPath = 'http://' + host + ':' + port + '/';

module.exports = {
    //插件项
    plugins: [
        //代码热替换
        new webpack.HotModuleReplacementPlugin(),
        //允许错误不打断程序
        new webpack.NoErrorsPlugin(),
        //浏览器同步测试
        new BrowserSyncPlugin({
            host: host,
            port: 3300,
            proxy: publicPath
        },{
            reload:false
        })
    ],
    devtool: 'source-map',
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
            loader: 'style!css!autoprefixer!postcss!sass'
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url?limit=8192&name=image/[name].[ext]?[hash]'
        }, {
            test: /\.(html)$/,
            loader: 'html?attrs=img:src'
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
    //dev-serve
    devServer: {
        contentBase: "./src",
        publicPath: '/',
        noInfo: true, //  --no-info option
        hot: true,
        inline: true,
        colors: true,
        host: host,
        port: port,
        historyApiFallback: true
    }
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