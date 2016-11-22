"use strict";

var gulp = require('gulp');
var $    = require('gulp-load-plugins')(),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  sourcemaps = require('gulp-sourcemaps'),
  jade = require('gulp-jade'),
  prefix = require('gulp-autoprefixer'),
  imagemin = require('gulp-imagemin'),
  spritesmith = require('gulp.spritesmith'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano');


// Note:
// Adding this return statement acts as a promise. Without the return statement, other tasks won't know when the concatScripts tasks as finished and so they'll start right away, instead of waiting for it to finish.
var sassPaths = [
  'bower_components/foundation/scss'
];


gulp.task('sass', function() {
  return gulp.src('scss/style.scss')
  .pipe(sourcemaps.init())
    .pipe($.sass({
      includePaths: sassPaths,
        outputStyle: 'expanded'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 8']
    }))
   .pipe(rename({ suffix: '.min' }))
    // .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});


// Gulp Compile JADE Task
gulp.task('jade', function () {
	return gulp.src("jade/index.jade")
	.pipe(jade({
      pretty: true
    }))
	.pipe(gulp.dest('jade'));
})


// Gulp Image Compressed Task
gulp.task('imagemin', function() {
gulp.src('img/*')
	.pipe(plumber())
.pipe(imagemin())
.pipe(gulp.dest('dest/img'));
});


// Gulp Sprite Task
gulp.task('sprite', function () {
  var spriteData = gulp.src('img/sprites/*.png')
      .pipe(spritesmith({
          /* this whole image path is used in css background declarations */
          imgName: '../img/sprite.png',
          cssName: 'sprite.css'
      }));
  spriteData.img.pipe(gulp.dest('img'));
  spriteData.css.pipe(gulp.dest('css'));
});

gulp.task('clear', function (done) {
  return cache.clearAll(done);
});
gulp.task("default", function() {
  console.log('workig...');
});
