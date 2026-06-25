const express = require('express');
const app = express();

const path = require('path');


//static folders
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'public', 'fonts')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

//Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));



//routes
app.get('/', (req, res) => {
    return res.render('index')
});

module.exports = app;