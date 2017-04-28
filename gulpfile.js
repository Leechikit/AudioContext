var gulp = require('gulp'),
	gulpwebpack = require('webpack-stream'),
	webpackConfig = require('./tasks/webpack.build'),
	webpack = require('webpack'),
	replace = require('gulp-replace'),
	config = require('./config').default,
	publicPath = config.publicPath+'project/tasksystem/pc/',
	outputPath = config.outputPath,
	date = new Date(),
	time = date.getTime();

gulp.task('default', ['html','image','css'])

gulp.task('webpack',function(){
    return gulp.src('./src/*.js')
    	.pipe(gulpwebpack(webpackConfig))
    	.pipe(gulp.dest(outputPath));
});

gulp.task('html', ['webpack'], function(){
	return gulp.src(outputPath+'html/*.html')
		.pipe(replace(/\.\.\/css\/(\S+\.(css))/g,publicPath+'css/$1?v='+time))
		.pipe(replace(/\.\.\/js\/(\S+\.(js))/g,publicPath+'js/$1?v='+time))
		.pipe(gulp.dest(outputPath+'html/'));
})

gulp.task('image', function() {
	return gulp.src('./src/image/**')
		.pipe(gulp.dest(outputPath + 'image/'));
});

gulp.task('css', function() {
	return gulp.src('./src/css/**')
		.pipe(gulp.dest(outputPath + 'css/'));
});