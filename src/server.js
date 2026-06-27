const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//load env
const productionMode = process.env.NODE_ENV === 'production'
if (!productionMode) {
    dotenv.config()
};

async function connectToDb () {
    await mongoose.connect(process.env.MONGO_URI, () => {

    })
};

function startServer () {
    app.listen(process.env.PORT, () => {
        console.log('server run on port 4002')
    })
};

function run () {
    startServer()
};

run();