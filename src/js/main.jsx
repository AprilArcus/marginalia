/** @jsx React.DOM */
var App = require('./components/app.jsx');
var React = require('react');

React.renderComponent(
  <App />,
  document.getElementById('main')
);
