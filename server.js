const express = require('express');
const passport = require('passport');

const app = express();
require('./lib/passport')(passport);

// app.use(require('morgan')('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

module.exports = app;
