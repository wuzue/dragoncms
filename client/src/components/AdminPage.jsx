import React, { useState, useEffect } from 'react' 

const AdminPage = () =>{

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')

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

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <input
        type='text'
        placeholder='Author'
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
      />
      <button type="submit">Create Post</button>
    </form>
  )
}

export default AdminPage