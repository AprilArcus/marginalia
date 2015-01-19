Experiments with React & Gulp
=============================

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