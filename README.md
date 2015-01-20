Experiments with React & ~~Gulp~~
=================================

15 Jan 2015
-----------

* Set up development environment in gulp with help of [Joe Maddalone]
(https://github.com/joemaddalone)'s [screencast][joemaddalone1].

[joemaddalone1]: https://egghead.io/lessons/react-development-environment-setup

```shell
npm install --global gulp
npm install --save-dev gulp gulp-browserify gulp-concat
npm install react reactify
```

* basic flux source tree

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

* Improving build system by migrating from gulp-browserify to real gulp
  commands
* These resources have been helpful:
  * https://medium.com/@sogko/gulp-browserify-the-gulp-y-way-bb359b3f9623
  * https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
  * http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
  * http://truongtx.me/2014/08/06/using-watchify-with-gulp-for-fast-browserify-build/
  * https://hacks.mozilla.org/2014/08/browserify-and-gulp-with-react/
  * http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html
  * http://christianalfoni.github.io/javascript/2014/10/30/react-js-workflow-part2.html

18 Jan 2015
-----------

https://twitter.com/ddprrt/status/529909875347030016

<blockquote class="twitter-tweet" lang="en"><p>&quot;What&#39;s bower?&quot;&#10;&quot;A package manager, install it with npm.&quot;&#10;&quot;What&#39;s npm?&quot;&#10;&quot;A package manager, you can install it with brew&quot;&#10;&quot;What&#39;s brew?&quot;&#10;...</p>&mdash; Stefan Baumgartner (@ddprrt) <a href="https://twitter.com/ddprrt/status/529909875347030016">November 5, 2014</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Thinking harder about this.

* http://substack.net/task_automation_with_npm_run
* http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/
* http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/

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
    bundle with a sourcemap via stdin. It relies on [Thorsten Lorenz]
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
    use [James Halliday](https://github.com/substack/)'s [method]
    (https://github.com/substack/watchify/issues/16#issuecomment-67732434)
    of writing to a tempfile. Since I refer to this path in three
    different scripts, I store it as
    `$npm_package_config_bundle_js_tmp_path`.
*   Empirically, watchify seems to stream its bundle into `.$tempfile`,
    then `rm $tempfile` and `mv .$tempfile $tempfile`.
*   `watch:scripts:watch-source-map` relies on [Stephen Belanger]
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

So, I'm starting to get a feel for the complexities, at least. This all
works for the moment, and at least I understand each step fairly
clearly. The use of onchange to hold together watchify and exorcise
feels very janky to me. I wonder if it's hearing a subtly wrong file
system event? I have to say that this all makes gulp's streaming i/o and
use of watchify's javascript API seem fairly compelling.