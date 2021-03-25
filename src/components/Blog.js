import React, { useState } from 'react'
const Blog = ({ blog }) => {
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

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      <div style={ { display: detailsVisible ? '' : 'none' }}>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button>like</button></p>
        {blog.user && <p>{blog.user.name}</p>}
      </div>

    </div>)
}

export default Blog
