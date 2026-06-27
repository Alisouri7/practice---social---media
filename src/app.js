const express = require('express');
const app = express();

const {setHeaders} = require('./utils/middlewares/headers');
const path = require('path');
const {errorHandler} = require('./utils/middlewares/errorHandler');


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));


//cors policy
app.use(setHeaders);

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


//404 error handler

app.use((req, res) => {
    return res.status(404).json({message: `this path is not found: ${req.path}`})
});



module.exports = app;