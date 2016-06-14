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
    spritesmith = require('gulp.spritesmith'),
    browserSync = require('browser-sync');


gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./"
    },
    host: 'localhost.globo.com'
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

// gulp.task('sprite', function () {
//     var spriteData = gulp.src('app/img/sprites/*.png')
//         .pipe(spritesmith({
//             /* this whole image path is used in css background declarations */
//             retinaSrcFilter: ['app/img/sprites/*@2x.png'],
//             imgName: '../img/sprite.png',
//             retinaImgName: 'sprite@2x.png',
//             cssName: 'sprite.css'
//         }));
//     spriteData.img.pipe(gulp.dest('img'));
//     spriteData.css.pipe(gulp.dest('css'));
// });

// gulp.task('sprite', function () {
//   var spriteData = gulp.src('app/images/sprites/*.png').pipe(spritesmith({
//     retinaSrcFilter: ['app/images/sprites/*@2x.png'],
//     imgName: 'sprite.png',
//     retinaImgName: 'sprite@2x.png',
//     cssName: 'sprite.scss'
//   }));
//   return spriteData.pipe(gulp.dest('app/images/spritesGerados'));
// });

// Clean
gulp.task('clean', function() {
  return del(['dist/styles', 'dist/scripts', 'dist/images', 'dist/templates']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('templates', 'styles', 'scripts',  'images');
});

gulp.task('server', ['browser-sync'], function(){
  gulp.start('templates', 'styles', 'scripts',  'images');
  // gulp.watch("app/img/sprites/*.png", ['sprite']);
  gulp.watch("app/images/**/*", ['images']);
  gulp.watch("app/styles/**/*.scss", ['styles']);
  gulp.watch("app/scripts/**/*.js", ['scripts']);
  gulp.watch("./app/**/*.jade", ['templates']);
  gulp.watch("*.html", ['bs-reload']);
});

