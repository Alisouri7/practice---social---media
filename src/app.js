const express = require('express');
const app = express();

const path = require('path');

//Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));


module.exports = app;