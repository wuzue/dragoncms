import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import DOMPurify from 'dompurify';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css'

const AdminPage = () => {
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleString()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = React.useState(
    () => EditorState.createEmpty(),
  )
  const [author, setAuthor] = useState('')

  const [posts, setPosts] = useState([])
  const [socket, setSocket] = useState(null)

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
          created_at: new Date().toLocaleString(),
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
    }),
  })
  if (response.ok){
    setTitle('');
    setContent('');
    // setContent(DOMPurify.sanitize(''))
    setAuthor('')
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

  return (<>
    <div className='grid grid-cols-2'>
    <form className='border-2 mb-[2rem] w-[50%]' onSubmit={handleSubmit}>
      <p className='font-bold mb-[1rem] underline'>Create a new post</p>
      <input
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
        type='text'
        placeholder='Author'
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
      />
      <button type='submit'>
        {editingPostId ? 'Update' : 'Create'}
      </button>
    {/* <hr></hr> */}
    </form>
    <div>
    {posts.map(post => (
      <div className='border-b-2 mb-[.5rem]' key={post.id}>
        <p><span className='font-bold'>Title:</span> {post.title}</p>
        <p><span className='font-bold'>Content:</span> {post.content}</p>
        <p><span className='font-bold'>Author:</span> {post.author}</p>
        <p><span className='font-bold'>On:</span> {post.date}</p>
        <p>Created at: {post.created_at}</p>
        <button className='bg-[yellow] pl-[.2rem] pr-[.2rem]' onClick={() => handleEditPost(post.id)}>Edit</button>
        <button className='bg-[red] pl-[.2rem] pr-[.2rem] text-white ml-[.5rem]' onClick={() => handleDeletePost(post.id)}>Delete</button>
      </div>
    ))}
    </div>
    </div>
  </>);
};

export default AdminPage;