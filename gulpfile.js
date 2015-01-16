// h/t Joe Maddalo's Flux Development Environment Setup
// https://egghead.io/lessons/react-development-environment-setup

// "We're going to set up a real simple gulp build process, so if you
//  haven't used gulp this is a great chance to learn about it."

// `$ npm install gulp-browserify gulp-concat react reactify`

var package_json = require('./package.json');

var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// var transform = require('vinyl-transform');

// How to keep a fast build with Browserify and ReactJS
// http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/

var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');
var browserify = require('browserify');
var reactify = require('reactify');
var production = process.env.NODE_ENV === 'production';

var scripts = function(options) {
    var bundler = browserify('./src/js/main.jsx', {
        basedir: __dirname,
        debug: !production,
        cache: {}, // required for watchify
        packageCache: {}, // required for watchify
        fullPaths: options.watch // required to be true only for watchify
    });
    if (options.watch) {
        bundler = watchify(bundler);
    }
    bundler.transform(reactify);

    var rebundle = function() {
        return bundler.bundle()
// Fast browserify builds with watchify                      
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
                    // log errors if they happen
                      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
                      .pipe(source('main.js'))
                    // optional, remove if you dont want sourcemaps
                      .pipe(buffer())
                    // loads map from browserify file
                      .pipe(sourcemaps.init({loadMaps: true}))
                    // writes .map file
                      .pipe(sourcemaps.write('./'))
                      .pipe(gulp.dest('./dist/js'));
    };

    bundler.on('update', rebundle);
    return rebundle();
}

gulp.task('scripts', function() {
    return scripts( {watch: false} );
});

gulp.task('watchScripts', function() {
    return scripts( {watch: true} );
});

// https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md

// var bundle = function() {
//   return bundler.bundle()
//     // log errors if they happen
    
//     .pipe(source('main.js'))
//     // optional, remove if you dont want sourcemaps
//     .pipe(buffer())
//     .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
//     .pipe(sourcemaps.write('./')) // writes .map file
//     //
//     .pipe(gulp.dest('./dist/js'));
// }

// gulp.task('js', bundle); // so you can run `gulp js` to build the file
// bundler.on('update', bundle); // on any dep update, runs the bundler

// "We just need to copy that index.html over to the `dist` directory.
//  There's plugins to do what I'm about to do, but this will work
//  just fine."

gulp.task('index', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
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
