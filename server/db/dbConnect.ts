import { Error } from 'mongoose'
const mongoose = require('mongoose')
require('dotenv').config()

async function dbConnect(){
  mongoose
    .connect(process.env.DB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useCreateIndex: true,
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      })
      .then(() => {
        console.log('connection ok fam, ive got this!');
      })
      .catch((error:Error) => {
        console.log('Couldnt connect to atlas');
        console.log(error);
      })
}

module.exports = dbConnect