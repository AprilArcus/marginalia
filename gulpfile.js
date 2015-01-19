// h/t Joe Maddalo's Flux Development Environment Setup
// https://egghead.io/lessons/react-development-environment-setup

// "We're going to set up a real simple gulp build process, so if you
//  haven't used gulp this is a great chance to learn about it."

// `$ npm install gulp-browserify gulp-concat react reactify`

var package_json = require('./package.json');

var gulp = require('gulp');
var util = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// var transform = require('vinyl-transform');

// How to keep a fast build with Browserify and ReactJS
// http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/

var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');
var browserify = require('browserify');
var notify = require('gulp-notify');
var reactify = require('reactify');
var envify = require('envify');
var uglifyify = require('uglifyify');

var production = process.env.NODE_ENV === 'production';

function handleError(task) {
  return function(err) {
    util.log(util.colors.red(err));
    notify.onError(task + ' failed, check the logs..')(err);
  };
}

var scripts = function(watch) {
    var bundler = browserify('./src/js/main.jsx', {
        basedir: __dirname,
        debug: !production,
        cache: {}, // required for watchify
        packageCache: {}, // required for watchify
        fullPaths: watch // required to be true only for watchify
    });
    if (watch) {
        bundler = watchify(bundler);
    }
    bundler.transform(reactify);
    // bundler.transform(envify, {global: true});
    // if (producton) {
    if (true) {
        bundler.transform({global: true}, uglifyify);
    }

    var rebundle = function() {
        var stream = bundler.bundle();
        stream.on('error', handleError('Browserify'));
        return stream.pipe(source('bundle.js'))
        // optional, remove if you dont want sourcemaps
                     .pipe(buffer())
                     .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
                     .pipe(sourcemaps.write('./')) // writes .map file
        // https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
                     .pipe(gulp.dest('./build/js'));
    };

    bundler.on('update', rebundle);
    return rebundle();
}

gulp.task('scripts', function() {
    return scripts(false);
});

gulp.task('watchScripts', function() {
    return scripts(true);
});

// "We just need to copy that index.html over to the `dist` directory.
//  There's plugins to do what I'm about to do, but this will work
//  just fine."

gulp.task('index', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('build'));
});

// "we're going to create our default task, which is just going to run
//  `browserify` and `copy`..."

gulp.task('default', ['js', 'index']);

// "and then just for good measure, we're gonna create a watch task, and
//  this will watch everything in `src` and if something there changes, 
//  it'll run the default task."

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']);
});
