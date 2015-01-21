Experiments with React & Gulp
=============================

15 Jan 2015
-----------

*   Set up development environment in gulp with help of [Joe Maddalone]
    (https://github.com/joemaddalone)'s [screencast]
    (https://egghead.io/lessons/react-development-environment-setup)

```shell
npm install --global gulp
npm install --save-dev gulp gulp-browserify gulp-concat
npm install react reactify
```

*    basic flux source tree

```
/marginalia
/marginalia/gulpfile.js
/marginalia/src/
/marginalia/src/index.html
/marginalia/src/js/
/marginalia/src/js/actions/
/marginalia/src/js/components/
/marginalia/src/js/components/app.js
/marginalia/src/js/stores/
/marginalia/src/js/dispatchers/
/marginalia/src/js/constants/
```

16 Jan 2015
-----------

Spent today improving the build system by migrating from gulp-browserify
to real gulp commands.

> The main _browserify_ library has enough [open issues]
> (https://github.com/substack/node-browserify/issues) at the moment (61
> open issues as of 14 Aug 2014) that it makes hard to guarantee that
> [a] gulp plugin that is a wrapper around _browserify_ will always be
> up-to-date.
>
> In fact, since 13 March 2014, the maintainer of _gulp-browserify_ has
> [stopped updating the codebase]
> (https://github.com/deepak1556/gulp-browserify/commits/master) after
> being [blacklisted by gulpjs]
> (https://github.com/gulpjs/plugins/issues/47).
>
> — [Hafiz Ismail](http://about.me/hafiz.ismail) ([@sogko]
>   (https://twitter.com/sogko)), [gulp + browserify, the gulp-y way]
>   (https://medium.com/@sogko/gulp-browserify-the-gulp-y-way-bb359b3f9623)

Hafiz uses a technique of wrapping browserify inside a vinyl-transform,
which he argues is superior to a vinyl-source-stream, since it allows
him to run browserify on a glob of multiple files simultaneously. This
will be good to keep in mind if I end up with multiple index pages,
each with their own bundle of react components (an easily foreseeable
scenario w/r/t Claire's portfolio!)

I ultimately opted to go with Mitchel Kuijpers' [solution](http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/),
and graft it to [this recipe](https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md)'s
technique for extracting source maps using a vinyl buffer. I also
referenced [Trần Xuân Trường](http://truongtx.me/about.html)
([@mr_truong_tx](https://twitter.com/mr_truong_tx))'s [implementation]
(http://truongtx.me/2014/08/06/using-watchify-with-gulp-for-fast-browserify-build/)
in de-babelizing Mitchel's over-clever technique of storing the
browserify object in a closure.

These resources were also helpful:

*   [Browserify and Gulp with React]
    (https://hacks.mozilla.org/2014/08/browserify-and-gulp-with-react/),
    by [Kevin Ngo](http://ngokevin.com) ([@ngokevin\_]
    (https://twitter.com/ngokevin_)) and [Robert Nyman]
    (http://robertnyman.com) ([@robertnyman]
    (https://twitter.com/robertnyman))
*   React JS and a browserify workflow, [Part 1]
    (http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html)
    and [Part 2]
    (http://christianalfoni.github.io/javascript/2014/10/30/react-js-workflow-part2.html)
    by [Christian Alfoni](http://christianalfoni.github.io) 
    ([@christianalfoni](https://twitter.com/christianalfoni))

Trường, Christian and others argue compellingly that the _matryoshka_
effect of running watchify inside gulp is worth it for hitting the sweet
spot of power and performance. Unfortunately, their clear writing and
lived experience was not enough to keep me from spending Sunday and
Monday chasing down the rabbit hole of re-implementing all this in
pidgin shell.

18 Jan 2015
-----------

> "What's bower?"  
> "A package manager, install it with npm."  
> "What's npm?"  
> "A package manager, you can install it with brew"  
> "What's brew?"
>
> — [Stefan Baumgartner](http://fettblog.eu) ([@ddprrt]
>   (https://twitter.com/ddprrt)) [November 5, 2014]
>   (https://twitter.com/ddprrt/status/529909875347030016)

Thinking harder about this.

*   [task automation with npm run](http://substack.net/task_automation_with_npm_run)
    by [James Halliday](http://substack.net/) ([@substack]
    (https://twitter.com/substack))
*   [Why we should stop using Grunt & Gulp]
    (http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/)
    and [How to Use npm as a Build Tool]
    (http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) by
    [Keith Cirkel](http://blog.keithcirkel.co.uk) ([@Keithamus]
    (https://twitter.com/keithamus))

What do I really need my build system to do?

* lint jsx with jshint/flow
* transpile jsx -> js
* generate source map (uglify?)
* browserify
* watchify? gulp.watch?
* livereload

19 Jan 2015
-----------

I've started a minimalist build system in package.json.scripts. It goes
like this:

*   I store `$npm_package_config_browserify_args` so they can be shared
    between browserify (`npm run build:scripts`) and watchify (`npm run
    watch:scripts`)
*   `build:scripts:extract-source-map` expects to receive a browserify
    bundle with a sourcemap via stdin. It relies on [thlorenz]
    (https://github.com/thlorenz)'s [exorcist]
    (https://github.com/thlorenz/exorcist) package (unstable, currently
    0.1.6).
*   `build:scripts` shells to `build:scripts:browserify` with
    `--loglevel=silent` so that the bundled JS goes to stdout, and
    pipes to `build:scripts:extract-source-map` (this is [smikes]
    (https://github.com/npm/npm/issues/6710#issuecomment-63105711)'s
    [workaround](https://github.com/npm/npm/issues/6710#issuecomment-63105711)
    for the npm script runner's mutation of stdout)
*   Watchify can't pipe to exorcist since it has no useful stdout, so I
    use [substack](https://github.com/substack/)'s [method]
    (https://github.com/substack/watchify/issues/16#issuecomment-67732434)
    of writing to a tempfile. Since I refer to this path in three
    different scripts, I store it as
    `$npm_package_config_bundle_js_tmp_path`.
*   Empirically, watchify seems to stream its bundle into `.$tempfile`,
    then `rm $tempfile` and `mv .$tempfile $tempfile`.
*   `watch:scripts:watch-source-map` relies on [Qard]
    (https://github.com/Qard)'s [onchange]
    (https://github.com/Qard/onchange) package (unstable, currently
    0.0.2) to listen for changes to `$tempfile`. It issues two commands:

    1.  `touch $tempfile;`, to make sure there is something to watch.
    2.  `onchange $tempfile -- npm run watch:scripts:extract-source-map`
    3.  `watch:scripts:extract-source-map` then redirects `$tempfile` to
        stdin and calls `build:scripts:extract-source-map`

    If I attempt to inline step 3 into 2 here, it breaks -- exorcist
    will complain that it was handed a file without a source map, and
    write an empty bundle.js. It seems like some kind of race condition?
    Is it catching `$tempfile` with its pants down in between an `rm`
    and an `mv`?

So, I'm starting to get a feel for the complexities, at least. This all
works for the moment, and at least I understand each step fairly
clearly. The use of onchange to hold together watchify and exorcise
feels very janky to me. I wonder if it's hearing a subtly wrong file
system event? I have to say that this all makes gulp's streaming i/o and
use of watchify's javascript API seem fairly compelling.

------------------------------------------------------------------------

And back to gulp. It's so fast! And yes there is this sense that
browserify wants to use its own plugins and vinyl-transform is going all
"but what about me"? And I don't at all understand what these lines do

```javascript
return stream.pipe(source('bundle.js'))
           // optional, remove if you dont want sourcemaps
             .pipe(buffer())
           // loads map from browserify file
             .pipe(sourcemaps.init({loadMaps: true}))
           // writes .map file
             .pipe(sourcemaps.write('./'))
           //
             .pipe(gulp.dest('./build'));
```

but the important thing is that _I might some day_, and it works right
now. Current problems:

*   Source maps are broken (reactify [issue #19](https://github.com/andreypopp/reactify/issues/19))
*   How do I use the ES6 transformer? Matt Greer's [notes]
    (http://www.mattgreer.org/articles/traceur-gulp-browserify-es6/) are
    promising.
    *   [ButuzGOL](https://github.com/ButuzGOL) [saves the day]
        (https://github.com/DragonLegend/game/blob/master/public/gulpfile.js#L127)!

20 Jan 2015
-----------

I spent the night reading reactify's source code, and it appears to be
entirely bypassing react-tools and issuing calls to directly to
jstransform (react-tools' backing library). This means a quick patch for
issue #19 is probably beyond me. I considered rewriting my own
react-tools browserify plugin in the image of [coffeeify]
(https://github.com/jnordberg/coffeeify) (a comparatively terse little
code poem), but I eventually decided to switch to [6to5]
(https://6to5.org), which parses JSX perfectly well, strips the
flow/typescript annotations I intend to use, worships at the Church of
the Sensible Default, and has better ES6 support than react-tools. I 
encountered this caveat in browserify/6to5ify, however:

```javascript
    var bundler = browserify(config.entryJS, {
        debug: !production,
        transform: [to5ify] // compiles, but no source maps
    });
```

```javascript
    var bundler = browserify(config.entryJS, {
        debug: !production,
    });
    bundler.transform(to5ify); // works
```

I've been through browserify's sources and I can't account for it, which
is frustrating but ultimately moot.

Spent a couple more hours cleaning up my gulpfile and making sure I
understood everything, and updated my 16 Jan 2015 entry.

Next up: live-reload! Implemented in

*   [es6-6to5-browserify-boilerplate/gulpfile.js]
    (https://github.com/thoughtram/es6-6to5-browserify-boilerplate/blob/master/gulpfile.js) by [Christoph Burgdorf]
    (https://cburgdorf.wordpress.com)
*   [Using Watchify with Gulp for fast Browserify build]
    (http://truongtx.me/2014/08/06/using-watchify-with-gulp-for-fast-browserify-build/)
    by [Trần Xuân Trường](http://truongtx.me/about.html)
    ([@mr_truong_tx](https://twitter.com/mr_truong_tx)) 
*   [React JS and a browserify workflow, Part 2]
    (http://christianalfoni.github.io/javascript/2014/10/30/react-js-workflow-part2.html)
    by [Christian Alfoni](http://christianalfoni.github.io) 
    ([@christianalfoni](https://twitter.com/christianalfoni))