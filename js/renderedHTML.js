var fs = require('fs');
var mustache = require('mustache');
var React = require('react/addons');
var nodeJSX = require('node-jsx');

nodeJSX.install({
  harmony: true,
  stripTypes: true,
});

var html = require('./HTML');

var template = fs.readFileSync(__dirname + '/../html/index.html', 'utf8');
var rendered = mustache.render(template, {
  appHTML: html,
  googleAnalyticsID: process.env['googleAnalyticsID'],
});

console.log(rendered);
