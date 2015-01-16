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