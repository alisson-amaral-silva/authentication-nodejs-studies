const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { authenticationStrategies } = require('./src/users');

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = app;
