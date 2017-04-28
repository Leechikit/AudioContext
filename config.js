/*
 *  配置参数
 */
exports.default = {
	//文件别名配置
	alias: {

	},
	//全局引入模块配置
	global: {
		'jquery': 'window.jQuery',
		'hiido_stat': 'window.hiido_stat',
		'hiido_init_department': 'window.hiido_init_department',
		'hiido_init_program': 'window.hiido_init_program',
		'yymobile': 'window.YYMobile'
	},
	//端口
	port: 3000,
	//静态资源地址
	publicPath: '//web.yystatic.com/',
	//项目输出地址
	outputPath: './dist/'
}

