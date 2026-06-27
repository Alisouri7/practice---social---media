const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//load env
const productionPhase = process.env.NODE_ENV === 'production'
if (!productionPhase) {
    dotenv.config()
};

async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB connected successfully: ${mongoose.connection.host}`)
        
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
};

function startServer() {
    app.listen(process.env.PORT, () => {
        console.log(`server running in ${productionPhase ? 'production' : 'development'} phase on port 4002`)
    })
};

function run() {
    startServer()
    connectToDb()
};

run();