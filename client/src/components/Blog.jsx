import React, {useState, useEffect} from 'react';
import io from 'socket.io-client'
import './Blog.css'
import luffy from '../assets/luffy.png'
import dragon from '../assets/dragon.png'
import { blogSubTitle, blogTitle } from '../configs';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import {GrCaretNext} from 'react-icons/gr'

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [hasMore, setHasmore] = useState(true)
  const postsPerPage = 3

  const nextPage = () => {
    setCurrentPage(currentPage + 1)
    // if(posts.length && posts.length < totalPosts){
    //   setCurrentPage(currentPage + 1)
    // }
  }
  
  //prevent pagination from being smaller than 1 (1 being the home)
  const previousPage = () => {
    if(currentPage > 1){
      setCurrentPage(currentPage - 1)
    }

  }

  useEffect(() => {
    fetch('http://localhost:3000/posts' , {mode: 'cors'})
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setTotalPosts(data.length)
        setHasmore(data.length === postsPerPage)
      })
      .catch(error => console.log('Error fetching posts: ', error));
    
    const socket = io('http://localhost:3000', { transports : ['websocket'] })
    setSocket(socket)
    socket.on('newPost', post => {
      setPosts([...posts, post])
      setTotalPosts(totalPosts + 1)
    })

    socket.on('serverRestarted', ()=> {
      window.location.reload()
    })
  }, []);

  // esse aqui é o legacy, ta funfando de boas
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  const paginate = pageNumber => setCurrentPage(pageNumber)

  return (<>
  <div id='main-div' className='w-full'>
    <div id='header-div' className='flex justify-evenly'>
      <div className='flex text-[1.2rem] font-[500] mt-[1rem]'>
        <p className='pr-[2rem]'><a href='/'><span className='hover:underline'>Press</span></a></p>
        <p><a href='/'><span className='hover:underline'>Research</span></a></p>
      </div>
      <div id='logo-div' className='flex flex-col items-center mt-[.5rem]'>
        <a href='/'><img id='blog-logo' className='w-[100px] rounded-full shadow-[0px_8px_24px_rgb(0,0,0,12%)]' src={dragon} alt='dragon'/></a>
        <h1 id='h1-blog' className='mt-[.5rem] text-[2rem] font-bold'>{blogTitle}</h1>
          <h2 id='h2-blog' className='italic text-[1.4rem] mt-[-.5rem]'>{blogSubTitle}</h2>
      </div>
      <div className='flex text-[1.2rem] font-[500] mt-[1rem]'>
        <p className='pr-[2rem]'><a href='/'><span className='hover:underline'>Docs</span></a></p>
        <p><a href='/'><span className='hover:underline'>About me</span></a></p>
      </div>
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

    {/* <div id='posts-div' className='max-w-xl mx-auto px-4 pt-[5rem] pb-16 text-gray-900 grid grid-cols-1'> */}
    <div id='posts-div' className='flex flex-col items-center mt-[5rem]'>
      {currentPosts.map(post => (
        <div key={post.id} className='text-center mb-[3rem]'>
          <div id='contentofposts' className=''>
            <p>{post.date}</p>
            <p className='text-[2rem] font-[700] hover:underline'><a href={`/posts/${post.id}`}>{post.title}</a></p>
            {/* <p className='post-content'>{post.content}</p> */}
            <p>By: <span className='text-[brown]'>{post.author}</span></p>
          </div>
        </div>
      ))}
    </div>

    
    <div id='pagination' className='flex justify-center mt-[1rem]'>
      <button className='pr-[.5rem] text-[blue] font-[500]' onClick={previousPage}>Previous Page</button>
      {/* <Pagination
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        paginate={paginate}
        currentPage={currentPage}
      /> */}
      <p className='font-bold text-[1.1rem] border-[1px] border-gray-500 rounded-[10px] w-[1.5rem] shadow-[0px_8px_24px_rgb(0,0,0,12%)]'><span className='flex justify-center'>{currentPage}</span></p>
        <button className='pl-[.5rem] text-[blue] font-[500]' onClick={nextPage}>Next Page</button>
    </div>

    {/* <div id='sponsored' className='flex pl-[.3rem] text-[.8rem]'>
      <p className=''>Powered by <a href='https://github.com/wuzue/dragoncms' target='_blank'><span className='font-bold'>DragonCMS</span></a></p>
    </div> */}
    </div>
  </>);
};

export default Blog;