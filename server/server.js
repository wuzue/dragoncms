const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt')
const basicAuth = require('express-basic-auth')
const multer = require('multer')

const USERNAME = 'admin'
const PASSWORD = 'dragonadmin'

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const defaultAdmin = {
  username: 'admin',
  password: bcrypt.hashSync('password', 10)
};

// Connect to Posts SQLite database
const db = new sqlite3.Database('./posts.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the posts database.');
});

// Connect to Users SQLite database
const dbUsers = new sqlite3.Database('./users.db', (err) => {
  if(err){
    console.error(err.message);
  }
  console.log('Connected to the users database');
})

// Create posts table if it does not exist
const createTable = `CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL
);`;
db.run(createTable, (err) => {
  if (err) {
    console.error(err.message);
  }
});

const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);`;
dbUsers.run(createUsersTable, (err) => {
  if(err){
    console.error(err.message);
  }
});

const insertDefaultAdmin = `INSERT INTO users (username, password) 
               VALUES (?, ?);`;
dbUsers.run(insertDefaultAdmin, [defaultAdmin.username, defaultAdmin.password], function(err) {
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
  const sql = `INSERT INTO posts (title, content, author, date) 
               VALUES (?, ?, ?, ?);`;
  db.run(sql, [newPost.title, newPost.content, newPost.author, newPost.date], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: 'An error occurred while adding the post' });
    }
    console.log(`A post has been added with id ${this.lastID}`);
    res.send({ message: 'Post added successfully' });
  });
});

// Route to delete a post
app.delete('/posts/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM posts WHERE id = ?;`;
  db.run(sql, [id], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: 'An error occurred while deleting the post' });
    }
    if (this.changes === 0) {
      return res.status(404).send({ message: 'Post not found' });
    }
    console.log(`Post with id ${id} has been deleted`);
    res.send({ message: 'Post deleted successfully' });
  });
});

app.post('/auth', (req, res) => {
  const { username, password } = req.body

  if (username === USERNAME && password === PASSWORD) {
    res.status(200).json({ message: 'User is authenticated' })
  } else {
    res.status(401).json({ message: 'User is not authenticated' })
  }
})

//edit post endpoint
app.put('/posts/:id', (req, res) => {
  const id = req.params.id;
  const updatedPost = req.body;
  const sql = `UPDATE posts
               SET title = ?, content = ?, author = ?, date = ?
               WHERE id = ?`;
  db.run(sql, [updatedPost.title, updatedPost.content, updatedPost.author, updatedPost.date, id], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: 'An error occurred while updating the post' });
    }
    res.send({ message: 'Post updated successfully' });
  });
});

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});