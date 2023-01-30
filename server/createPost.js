const {Client} = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'blog',
  password: 'akawuz13',
  port: 5432,
});

client.connect();

const createPost = async (title, content, author) => {
  try {
    const query = 'INSERT INTO posts (title, content, author) VALUES ($1, $2, $3)';
    const values = [title, content, author];
    const res = await client.query(query, values);
    console.log('Post created');
  } catch (error) {
    console.log('Error creating post: ', error);
  }
};

createPost('Ta foda', 'asdhasdusadhsaudh', 'renan');