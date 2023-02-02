import React, {useState, useEffect} from 'react';
import io from 'socket.io-client'
import './Blog.css'
import luffy from '../assets/luffy.png'
import dragon from '../assets/dragon.png'
import { blogSubTitle, blogTitle } from '../configs';
import { Link } from 'react-router-dom';

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

  return (<>
    <div className='flex flex-col items-center mt-[.5rem]'>
      <a href='/'><img className='w-[150px] rounded-full shadow-[0px_8px_24px_rgb(0,0,0,12%)]' src={dragon} alt='dragon'/></a>
      <h1 className='mt-[.5rem] text-[2rem] font-[600]'>{blogTitle}</h1>
      <h2 className='text-[1.4rem] mt-[-.5rem]'>{blogSubTitle}</h2>
    </div>

    <div className='grid grid-cols-5 gap-[2rem] text-center mt-[2rem]'>
      {posts.map(post => (
        <div key={post.id}>
          <p className='text-[1.5rem] text-[blue] font-[400]'><a href={`/posts/${post.id}`}>{post.title}</a></p>
          {/* <p className='post-content'>{post.content}</p> */}
          <p className=''>Author: <span className='text-[brown]'>{post.author}</span></p>
        </div>
      ))}
    </div>
  </>);
};

export default Blog;