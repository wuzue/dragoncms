import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')

  const [posts, setPosts] = useState([])
  const [socket, setSocket] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
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
      setAuthor('')
      window.alert('success')
    }else{
      //error msg
    }
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

  //CHANGE IT!!!!!!!!!!!!!!!!!!!! ITS ONLY FOR DEVELOPMENT
  //LOGIN IS ON FRONT-END, CHANGE IT!!!!!!
  const handleLogin = (event) => {
    event.preventDefault();
    if (username === 'admin' && password === 'dragon') {
      setIsAuthorized(true);
    } else {
      console.log(`errado manoookkkkk`)
    }
  };

  if (!isAuthorized) {
    return (
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (<>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <ReactQuill
        value={content}
        onChange={(value) => setContent(value)}
      />
      {/* <textarea
        placeholder="Content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      /> */}
      <input
        type='text'
        placeholder='Author'
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
      />
      <button type="submit">Create Post</button>
    </form>
    <div id='posts-admin' className=''>
      <p className='font-[700] text-[1.2rem] uppercase'><span className='bg-[black] pr-[1rem] pl-[1rem] text-[white]'>Blog posts</span></p>
      <div className=''>
        {posts.map(post => (
          <div key={post.id} className='border-b-[1px]'>
            <p className='text-[1.1rem] font-[600] mt-[.5rem]'><a target='_blank' href={`/posts/${post.id}`}>{post.title}</a></p>
            {/* <p className='post-content'>{post.content}</p> */}
            <p className=''>Author: <span className='text-[brown]'>{post.author}</span></p>
            <button className='bg-[red] text-white pr-[.1rem]' onClick={() => handleDeletePost(post.id)}>Delete Post</button>
          </div>
        ))}
      </div>
    </div>
  </>);
};

export default AdminPage;