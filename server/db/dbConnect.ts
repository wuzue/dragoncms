import { Error } from 'mongoose'
const mongoose = require('mongoose')
require('dotenv').config()

async function dbConnect(){
  mongoose
    .connect(process.env.DB_URL as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useCreateIndex: true,
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