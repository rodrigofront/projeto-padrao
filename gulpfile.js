var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    postcss = require('gulp-postcss'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    stylus = require('gulp-stylus'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    del = require('del'),
    browserSync = require('browser-sync');


gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('templates', function() {
  gulp.src('./app/**/!(_)*.jade')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({stream:true}))
});


gulp.task('styles', function(){
  gulp.src(['app/styles/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('app/scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

// Clean
gulp.task('clean', function() {
  return del(['dist/styles', 'dist/scripts', 'dist/images', 'dist/templates']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('templates', 'styles', 'scripts', 'images');
});

gulp.task('server', ['browser-sync'], function(){
  gulp.start('templates', 'styles', 'scripts', 'images');
  gulp.watch("app/images/**/*", ['images']);
  gulp.watch("app/styles/**/*.scss", ['styles']);
  gulp.watch("app/scripts/**/*.js", ['scripts']);
  gulp.watch("./app/**/*.jade", ['templates']);
  gulp.watch("*.html", ['bs-reload']);
});

