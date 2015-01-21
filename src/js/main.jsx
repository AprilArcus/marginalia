// var App = require('./components/app.jsx'); // commonjs
import App from './components/app.jsx';       // es6

// var React = require('react'); // commonjs
import React from 'react';       // es6

React.render(
  <App />,
  document.getElementById('main')
);
