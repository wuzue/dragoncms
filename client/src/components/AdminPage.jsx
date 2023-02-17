import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import DOMPurify from 'dompurify';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css'
import './AdminPage.css'

const AdminPage = () => {
  const currentDate = new Date()
  const [showBlogPosts, setShowBlogPosts] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = React.useState(
    () => EditorState.createEmpty(),
  )
  const [author, setAuthor] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [posts, setPosts] = useState([])
  const [socket, setSocket] = useState(null)

  const handleBlogPostClick = () => {
    setShowBlogPosts(true)
    setShowCreatePost(false)
  }

  const handleCreatePostClick = () => {
    setShowBlogPosts(false)
    setShowCreatePost(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (editingPostId) {
      // Update post
      const response = await fetch(`http://localhost:3000/posts/${editingPostId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          author,
          // created_at: new Date().toLocaleString(),
          // date,
        }),
      })
      try{
      if (response.ok) {
        setTitle('')
        setContent('')
        setAuthor('')
        setEditingPostId(null)
        window.alert('Post updated successfully')
      } 
    } catch(error){
      console.error(error)
    }
      // else {
      //   // handle error
      //   console.log(Error)
      // }
    } else {
      
      const response = await fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      
      title,
      content,
      author,
      // date: new Date(date).toLocaleDateString('default', { month: 'short', day: 'numeric'})
      date: new Date(date).toUTCString()
      // date: formattedDate
    }),
  })
  if (response.ok){
    setTitle('');
    setContent('');
    // setContent(DOMPurify.sanitize(''))
    setAuthor('')
    setDate('')
    window.alert('success')
  }else{
    //error msg
  }
    }
  }

  //sanitaze react quill text
  const handleChange = (value) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    setContent(sanitizedValue);
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

  const handleDeletePost = async (id) => {
    const response = await fetch(`http://localhost:3000/posts/${id}`, {
      method: 'DELETE',
    })
    if(response.ok) {
      const updatedPosts = posts.filter(post => post.id !== id)
      setPosts(updatedPosts)
      window.alert('Sucess')
    }else{
      // console.error(error)
    }
  }

  const handleEditPost = (id) => {
    const post = posts.find(post => post.id === id)
    setTitle(post.title)
    setContent(post.content)
    setAuthor(post.author)
    setDate(post.date)
    setEditingPostId(id)
  }

  //CHANGE IT!!!!!!!!!!!!!!!!!!!! ITS ONLY FOR DEVELOPMENT
  //LOGIN IS ON FRONT-END, CHANGE IT!!!!!!
  const handleLogin = (event) => {
    event.preventDefault();
    if (username === 'admin' && password === 'dragon') {
      setIsAuthorized(true);
    } else {
      window.alert('errado kkkk')
      console.log(`errado manoookkkkk`)
    }
  };

  

  if (!isAuthorized) {
    return (
      <form onSubmit={handleLogin} className='text-[1.5rem] h-screen flex flex-col justify-center items-center'>
        <input className='border-b-[1px] mb-[1rem]'
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input className='border-b-[1px]'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit" className='border-2 p-[.2rem] mt-[1rem]' >Login</button>
      </form>
    );
  }

  const dateStr = new Date(date).toUTCString();
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric' });

  return (<>
    <div className='container'>
      <div id='side menu' className='sidebar fixed w-[15rem] h-[100vh] bg-[#4C4B63] shadow-[0px_8px_24px_rgb(0,0,0,30%)]'>
        <p className={showCreatePost ? "hover:cursor-pointer text-[white] active:bg-[#9493B6] p-3" : "active"} onClick={handleBlogPostClick}><span className='font-[500]'>Blog Posts</span></p>
        <div className='w-full bg-[gray] h-[1px] '></div>
        <p id='posthover' className={showBlogPosts ? "hover:cursor-pointer text-[white] active:bg-[#9493B6] p-3" : "active"} onClick={handleCreatePostClick}><span className=' font-[500]'>Create Post</span></p>
        <div className='w-full bg-[gray] h-[1px]'></div>
        <div className='absolute bottom-1 left-1'>
          <p className='text-[white]'>Powered by <b>DragonCMS</b></p>
        </div>
      </div>
      {/* {showBlogPosts && <div>Blog posts go here</div>} */}
    {/* {showCreatePost && <div>Create post form goes here</div>} */}

    <div id='formposts' className='grid grid-cols-2 mt-[1rem] pl-[20rem]'>
    {showCreatePost && <form className='border-2 mb-[2rem] h-[15rem]' onSubmit={handleSubmit}>
      <p className='font-bold mb-[1rem] underline'>Create a new post</p>
      <input
        className='w-[100%]'
        type="text"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <ReactQuill
        value={content}
        onChange={handleChange}
      />
      <input
        className='w-[100%]'
        type='text'
        placeholder='Author'
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
      />
      <input
        className=''
        type='date'
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />
      <button type='submit' className='bg-[black] text-white p-[.5rem]'>
        {editingPostId ? 'Update' : 'Create'}
      </button>
    {/* <hr></hr> */}
    </form>}
    {showBlogPosts && <div>
    {posts.map(post => (
      <div className='border-b-2 mb-[.5rem]' key={post.id}>
        <p><span className='font-bold'>Title:</span> {post.title}</p>
        <p><span className='font-bold'>Content:</span> {post.content}</p>
        <p><span className='font-bold'>Author:</span> {post.author}</p>
        <p><span className='font-bold'>Created on:</span> {post.date}</p>
        {/* <p>Created at: {post.created_at}</p> */}
        <button className='bg-[yellow] pl-[.2rem] pr-[.2rem]' onClick={() => handleEditPost(post.id)}>Edit</button>
        <button className='bg-[red] pl-[.2rem] pr-[.2rem] text-white ml-[.5rem]' onClick={() => handleDeletePost(post.id)}>Delete</button>
      </div>
    ))}
    </div>}
    </div>
    </div>
  </>);
};

export default AdminPage;