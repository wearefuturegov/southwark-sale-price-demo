'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var vueify = require('vueify')
var envify = require('envify/custom')

sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass({
      includePaths: 'node_modules'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('scripts', function() {
  browserify({
    entries: 'src/index.js'
  })
  .transform('envify', {
    global: true,
    'NODE_ENV': process.env.NODE_ENV
  })
  .transform(vueify)
  .bundle()
  .pipe(source('index.js'))
  .pipe(gulp.dest('./js'));
});

gulp.task('scripts:watch', function() {
  gulp.watch('./src/**/*.js', ['scripts'])
})