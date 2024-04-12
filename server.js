const express = require('express');
const passport = require('passport');

const app = express();

app.set('view engine', 'pug');

app.use(require('morgan')('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./lib/passport')(passport);
app.use(passport.initialize());

module.exports = app;
