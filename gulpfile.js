"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')(),
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
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    del = require('del'),
    concat = require('gulp-concat'),
    html5Lint = require('gulp-html5-lint'),
    prefix = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    cmq = require('gulp-combine-media-queries'),
    ignore = require('gulp-ignore'), // Helps with ignoring files and directories in our run tasks
    jshint = require('gulp-jshint'),
    eslint = require('gulp-eslint'),
    reload = browserSync.reload,
    babel = require("gulp-babel"),
    runSequence = require('run-sequence');


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
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream())
        .pipe(notify({
            message: 'Styles task complete'
        }));
});




// Gulp Concat Scripts Task
gulp.task('scripts', function() {
    // return gulp.src([
    //         'bower_components/jquery/dist/jquery.js',
    //         'bower_components/what-input/what-input.js',
    //         'bower_components/foundation-sites/dist/foundation.js',
    //         'scripts/**/*.js'
    //     ])
    return gulp.src('./app/js/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./test/js'))
        .pipe(reload({ stream: true }));
});

// Gulp Minify Scripts Task
// this allows you to run concatScripts first then minifyScripts task will runs straight after
gulp.task('minifyScripts', ['scripts'], function() {
    return gulp.src('./test/js/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./test/js'))
        .pipe(reload({ stream: true }));
});


// function lint(files) {
//     return gulp.src(files)
//         .pipe(eslint())
//         .pipe(reload({ stream: true, once: true }))
//         .pipe(eslint.format())
//         .pipe(eslint.failAfterError());
// }
// gulp.task('lint', () => {
//     return lint('./app/js/script.js')
//         .pipe(gulp.dest('scripts'));
// });





// Gulp Compile JADE Task
gulp.task('jade', function() {
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
gulp.task('sprite', function() {
    var spriteData = gulp.src('img/sprites/*.png')
        .pipe(spritesmith({
            /* this whole image path is used in css background declarations */
            imgName: '../img/sprite.png',
            cssName: 'sprite.css'
        }));
    spriteData.img.pipe(gulp.dest('img'));
    spriteData.css.pipe(gulp.dest('css'));
});



gulp.task('watch', function(done) {
    gulp.watch('./scss/**/*.scss', ['sass']);
    // gulp.watch('jade/index.jade', ['jade']);
});



gulp.task('clear', function(done) {
    return cache.clearAll(done);
});


gulp.task('default', ['sass', 'jade', 'browser-sync'], function() {

    gulp.watch('./scss/**/*.scss', ['sass', browserSync.reload]);
    // gulp.watch('./assets/js/**/*.js', ['browserifyscriptsJs', browserSync.reload]);
    gulp.watch('./js/*.js', ['browserifyVendorsJs', browserSync.reload]);
});





gulp.task('sass-watch', ['sass'], function(done) {
    browserSync.reload();
    done();
});
// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./scss/**/*.scss", ['sass']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});
