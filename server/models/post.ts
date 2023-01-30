const mongoose = require("mongoose")  

const postSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: String, required : true},
  date: {type: Date, default: Date.now}
})

const Post = mongoose.model('posts', postSchema)

// module.exports = Post
export default Post;