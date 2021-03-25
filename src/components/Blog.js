import React, { useState } from 'react'
const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleLike = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id

    }
    updateBlog(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    deleteBlog(blog.id)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      <div style={ { display: detailsVisible ? '' : 'none' }}>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={handleLike}>like</button></p>
        {blog.user && <p>{blog.user.name}</p>}
        {/* user.id does not returned from the api when login! */}
        {blog.user.username === user.username && <button onClick={handleDelete}>remove</button>}
      </div>

    </div>)
}

export default Blog
