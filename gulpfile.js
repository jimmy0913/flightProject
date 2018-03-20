var gulp = require('gulp');
var scss = require('gulp-sass');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');


gulp.task('scss',function(){
	gulp.src('./src/scss/all.scss')
	.pipe(scss())
	.pipe(gulp.dest('./src/css'))
})


gulp.task('watch',function(){
	livereload.listen();
	gulp.watch('./src/scss/**/*.scss',function(event){
		gulp.run('scss');
	})
	gulp.watch(['./src/*.ejs','./src/css/**/*.css','./src/js/**/*.js'],function(event){
		livereload.changed(event.path);
	})
})