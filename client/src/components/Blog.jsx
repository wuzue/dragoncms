import React, {useState, useEffect} from 'react';
import io from 'socket.io-client'
import './Blog.css'

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/posts' , {mode: 'cors'})
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(error => console.log('Error fetching posts: ', error));
    
    const socket = io('http://localhost:3000', { transports : ['websocket'] })
    setSocket(socket)
    socket.on('newPost', post => {
      setPosts([...posts, post])
    })

    socket.on('serverRestarted', ()=> {
      window.location.reload()
    })
  }, []);

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h1>{post.title}</h1>
          <p className='post-content'>{post.content}</p>
          <p className='post-author'>Author: {post.author}</p>
        </div>
      ))}
    </div>
  );
};

export default Blog;