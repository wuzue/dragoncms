import React, {useState, useEffect} from 'react';
import io from 'socket.io-client'
import './Blog.css'
import luffy from '../assets/luffy.png'
import dragon from '../assets/dragon.png'
import { blogSubTitle, blogTitle } from '../configs';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  const nextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const previousPage = () => {
    setCurrentPage(currentPage - 1)
  }

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

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  const paginate = pageNumber => setCurrentPage(pageNumber)

  return (<>
    <div className='flex flex-col items-center mt-[.5rem]'>
      <a href='/'><img className='w-[150px] rounded-full shadow-[0px_8px_24px_rgb(0,0,0,12%)]' src={dragon} alt='dragon'/></a>
      <h1 className='mt-[.5rem] text-[2rem] font-[600]'>{blogTitle}</h1>
      <h2 className='text-[1.4rem] mt-[-.5rem]'>{blogSubTitle}</h2>
    </div>

    {/* default posts mapping */}
    {/* <div className='grid grid-cols-5 gap-[2rem] text-center mt-[2rem]'>
      {posts.map(post => (
        <div key={post.id}>
          <p className='text-[1.5rem] text-[blue] font-[400]'><a href={`/posts/${post.id}`}>{post.title}</a></p>
          <p className=''>By: <span className='text-[brown]'>{post.author}</span></p>
        </div>
      ))}
    </div> */}

    <div className='grid grid-cols-5 gap-[2rem] text-center mt-[2rem]'>
      {currentPosts.map(post => (
        <div key={post.id}>
          <p className='text-[1.5rem] text-[blue] font-[400]'><a href={`/posts/${post.id}`}>{post.title}</a></p>
          {/* <p className='post-content'>{post.content}</p> */}
          <p className=''>By: <span className='text-[brown]'>{post.author}</span></p>
        </div>
      ))}
    </div>

    {/* pagination */}
    <div className='flex justify-center mt-[10rem]'>
      <button onClick={previousPage}><span className='text-[blue] pr-[1rem]'>Previous Page </span></button>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      <button onClick={nextPage}><span className='text-[blue] pl-[1rem]'>Next Page</span></button>
    </div>

    <div className='flex absolute bottom-0 pl-[.3rem] text-[.8rem]'>
      <p>Powered by <a href='https://github.com/wuzue/dragoncms' target='_blank'><span className='font-bold'>DragonCMS</span></a></p>
    </div>
  </>);
};

export default Blog;