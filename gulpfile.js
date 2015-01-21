'use strict';

var _ = require('lodash');
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

// h/t Mitchel Kuijpers (@mitchelkuijpers)
// "How to keep a fast build with Browserify and ReactJS"
// http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
// and Trần Xuân Trường (@mr_truong_tx)
// "Using Watchify with Gulp for fast Browserify build"
// http://truongtx.me/2014/08/06/using-watchify-with-gulp-for-fast-browserify-build/

var bundleScripts = function(options) {
    var bundler = browserify(
        _.extend({debug: !production}, watchify.args)
    );
    bundler.add(config.entryJS);
    bundler.transform(to5ify);
    // if (production) {
        bundler.transform(uglifyify, {global: true});
    // }

    var writeBundledScripts = function(browserifyObject) {
        browserifyObject.bundle()
                        .on('error', handleError('Browserify'))
                        .pipe(source(config.outputJS))
                      // gulp-sourcemaps
                      // https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
                        .pipe(buffer())
                      // load map from browserify file
                        .pipe(sourcemaps.init({loadMaps: true}))
                      // write .map file
                        .pipe(sourcemaps.write('./'))
                        .pipe(gulp.dest(config.buildDir));
    };

    if (options.watch) {
        bundler = watchify(bundler);
        bundler.on('update', function() {
            writeBundledScripts(bundler)
        });
    }

    writeBundledScripts(bundler);
};

gulp.task('build:scripts', function() {
    return bundleScripts({watch: false});
});

gulp.task('watch:scripts', function() {
    return bundleScripts({watch: true});
});

gulp.task('clean:scripts', function(callback) {
    del([config.buildDir+'/'+config.outputJS,
         config.buildDir+'/'+config.outputJS+'.map'],
        callback);
});

// we need to ensure build/index.html exists before we can watch it
// c.f. "Running tasks in series, i.e. Task Dependency"
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-tasks-in-series.md

gulp.task('build:markup', function(callback) {
    gulp.src(config.indexHTML)
        .pipe(gulp.dest('build'));
    callback();
});

gulp.task('watch:markup', ['build:markup'], function() {
    gulp.watch(config.indexHTML, ['build:markup']);
});

gulp.task('clean:markup', function(callback) {
    del(['build/index.html'], callback);
});

gulp.task('build', ['build:scripts', 'build:markup']);
gulp.task('watch', ['watch:scripts', 'watch:markup']);

gulp.task('default', ['watch']);