import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>title
        <input type="text" value={newTitle} name="Title" aria-label="title" onChange={({ target }) => setNewTitle(target.value)}/>
      </div>
      <div>author
        <input type="text" value={newAuthor} name="Author" aria-label="author" onChange={({ target }) => setNewAuthor(target.value)} />
      </div>
      <div>url
        <input type="text" value={newUrl} name="Url"  aria-label="url" onChange={({ target }) => setNewUrl(target.value)} />
      </div>
      <button type="submit" aria-label="create new blog">create</button>
    </form>)
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
