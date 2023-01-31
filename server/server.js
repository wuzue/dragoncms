const express = require('express')
const app = express()
const posts = require('./posts.json')
const cors = require('cors');
const server = require('http').Server(app)
const io = require('socket.io')(server)
const nodemon = require('nodemon')

nodemon({
  script: 'server.js',
  ext: 'js'
})

nodemon.on('restart', function(){
  console.log('server restarted');
  io.emit('serverRestarted')
})

nodemon.on('quit', function(){
  console.log('app has quit');
  process.exit()
})

nodemon.on('error', function(err){
  console.error('an error occurred: ', err);
})

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}));

app.use(express.json())

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/posts', (req, res) => {
  const newPost = req.body
  posts.push(newPost)
  res.send(posts)
})

io.on('connection', (socket) => {
  console.log('client connected');
})

server.listen(3000, () => {
  console.log('server is running on port 3000');
})