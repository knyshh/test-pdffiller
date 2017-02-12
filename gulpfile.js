var gulp = require('gulp');
var pug = require('gulp-pug');
var  autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var svgSymbols = require('gulp-svg-symbols');
var svgmin = require('gulp-svgmin');
var inject = require('gulp-inject');
var path = require('path');

gulp.task('sprites', function () {
    return gulp.src('src/img/svg/*.svg')
        .pipe(svgSymbols())
        .pipe(gulp.dest('src/views/generated-sprite'));
});

gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

gulp.task('views', function buildHTML() {
    return gulp.src('src/views/*.pug')
        .pipe(pug({
            pretty: true
        })).pipe(gulp.dest('./public'));
});

gulp.task('copyimg', function () {
    return gulp
        .src('src/img/*')
        .pipe(gulp.dest('./public/img'));
});

gulp.task('server',['sass','views'], function () {
    browserSync.init({
        port: 4000,
        server: {
            baseDir: './public'
        }
    });

    gulp.watch("src/sass/**/*.scss", ['sass']);
    gulp.watch("src/views/**/*.pug", ['views']);
    gulp.watch("src/views/**/*.pug").on('change', browserSync.reload);

});

gulp.task('default', ['server','copyimg','sprites']);