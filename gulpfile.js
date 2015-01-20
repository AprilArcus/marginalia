'use strict';

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');

var util = require('gulp-util');
var notify = require('gulp-notify');

var browserify = require('browserify');
var watchify = require('watchify');
var to5ify = require("6to5ify");
var uglifyify = require('uglifyify');
var sourcemaps = require('gulp-sourcemaps');

var production = process.env.NODE_ENV === 'production';

var config = {
    buildDir: './build',
    entryJS: './src/js/main.jsx',
    outputJS: 'bundle.js',
    indexHTML: 'src/index.html'
};

function handleError(task) {
  return function(err) {
    util.log(util.colors.red(err));
    notify.onError(task + ' failed, check the logs..')(err);
  };
}

// How to keep a fast build with Browserify and ReactJS
// http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/

var scripts = function(opts) {
    console.log('initializing browserify');
    var bundler = browserify(config.entryJS, {
        debug: !production,
        cache: {},            // required for watchify
        packageCache: {},     // required for watchify
        fullPaths: opts.watch // required to be true only for watchify
    });
    bundler.transform(to5ify);
    if (production) {
        bundler.transform(uglifyify, {global: true});
    }
    if (opts.watch) {
        bundler = watchify(bundler);
    }
    var rebundle = function() {
        var stream = bundler.bundle();
        stream.on('error', handleError('Browserify'));
        return stream.pipe(source(config.outputJS))
                   // optional, remove if you dont want sourcemaps
                     .pipe(buffer())
                   // loads map from browserify file
                     .pipe(sourcemaps.init({loadMaps: true}))
                   // writes .map file
                     .pipe(sourcemaps.write('./'))
                   // https://github.com/gulpjs/gulp/blob/master/docs/recipes/
                     .pipe(gulp.dest(config.buildDir));
    };
    bundler.on('update', rebundle);
    return rebundle();
};

gulp.task('build:scripts', function() {
    return scripts({watch: false});
});

gulp.task('watch:scripts', function() {
    return scripts({watch: true});
});

gulp.task('clean:scripts', function(callback) {
    del([config.buildDir+'/'+config.outputJS,
         config.buildDir+'/'+config.outputJS+'.map'],
        callback);
});

gulp.task('build:markup', function() {
    gulp.src(config.indexHTML)
        .pipe(gulp.dest('build'));
});

gulp.task('watch:markup', function() {
    gulp.watch(config.indexHTML, ['build:markup']);
});

gulp.task('clean:markup', function(callback) {
    del(['build/index.html'], callback);
});



gulp.task('build', ['build:scripts', 'build:markup']);
gulp.task('watch', ['watch:scripts', 'watch:markup']);

gulp.task('default', ['watch']);