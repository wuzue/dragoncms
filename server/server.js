const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./posts.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the posts database.');
});

// Create posts table if it does not exist
const createTable = `CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL
);`;
db.run(createTable, (err) => {
  if (err) {
    console.error(err.message);
  }
});

// Route to retrieve all posts
app.get('/posts', (req, res) => {
  const sql = `SELECT * FROM posts;`;
  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: 'An error occurred while retrieving posts' });
    }
    res.send(rows);
  });
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM posts WHERE id = ?;`;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: 'An error occurred while retrieving the post' });
    }
    if (!row) {
      return res.status(404).send({ message: 'Post not found' });
    }
    res.send(row);
  }); 
});

// Route to add a new post
app.post('/posts', (req, res) => {
  const newPost = req.body;
  const sql = `INSERT INTO posts (title, content, author) 
               VALUES (?, ?, ?);`;
  db.run(sql, [newPost.title, newPost.content, newPost.author], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: 'An error occurred while adding the post' });
    }
    console.log(`A post has been added with id ${this.lastID}`);
    res.send({ message: 'Post added successfully' });
  });
});

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});