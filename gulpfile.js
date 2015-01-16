// h/t Joe Maddalo's Flux Development Environment Setup
// https://egghead.io/lessons/react-development-environment-setup

// "We're going to set up a real simple gulp build process, so if you
//  haven't used gulp this is a great chance to learn about it."

// `$ npm install gulp-browserify gulp-concat react reactify`

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

// "Okay, we're going to set up our first gulp task, and this is going
//  to be our browserify task."
gulp.task('browserify', function() {
    gulp.src('src/js/main.js')
     // "We're going to tap into our reactify library, and that's going
     //  to convert all our JSX into Javascript."
        .pipe(browserify({transform: 'reactify'}))
     // "We're going to need to concat all that"
        .pipe(concat('main.js'))
     // "then we just need our destination folder"
        .pipe(gulp.dest('dist/js'));
});

// "We just need to copy that index.html over to the `dist` directory.
//  There's plugins to do what I'm about to do, but this will work
//  just fine."

gulp.task('copy', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

// "we're going to create our default task, which is just going to run
//  `browserify` and `copy`..."

gulp.task('default', ['browserify', 'copy']);

// "and then just for good measure, we're gonna create a watch task, and
//  this will watch everything in `src` and if something there changes, 
//  it'll run the default task."

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']); // ignoring src/index.html ?
});
