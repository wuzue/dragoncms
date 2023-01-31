const express = require('express')
const app = express()
const posts = require('./posts.json')
const cors = require('cors');
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(cors({
  origin: '*', // use your actual domain name (or localhost), using * is not recommended
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}))

app.get('/posts', (req, res) => {
  res.send(posts)
})

io.on('connection', (socket) => {
  console.log('client connected');
})

server.listen(3000, () => {
  console.log('server is running on port 3000');
})