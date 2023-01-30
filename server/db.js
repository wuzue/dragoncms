const { Client } = require('pg');
const createPost = require('./createPost');

async function dbConnect() {
  try {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'blog',
      password: 'password',
      port: 5432,
    });
    await client.connect()
      .then(() => {
        console.log('connected to postgreSQL');
        createPost(client, {
          title: 'My First Post',
          content: 'This is the content of my first post',
          author: 'dragon',
        });
      })
      .catch((error) => {
        console.log('there was an error while connecting to the server', error);
      });
  } catch (error) {
    console.log('ERROR');
  }
}

dbConnect();