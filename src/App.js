import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const compareLikesDescending = (a, b) => b.likes - a.likes

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort(compareLikesDescending)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith('Wrong credentials', 'error')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin} >
      <div>username
        <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>password
        <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    blogFormRef.current.toggleVisibility()

    // get the returned blog populated with the user info
    const returnedBlogPopulated = await blogService.get(returnedBlog.id)
    setBlogs([...blogs, returnedBlogPopulated])

    notifyWith(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
  }

  const updateBlog = async (id, blogObject) => {
    const returnedBlog = await blogService.update(id, blogObject)

    // get the returned blog populated with the user info
    const returnedBlogPopulated = await blogService.get(returnedBlog.id)
    const updatedblogs = blogs.map(blog => blog.id === returnedBlogPopulated.id ? returnedBlogPopulated : blog)
    setBlogs(updatedblogs.sort(compareLikesDescending))
  }

  const deleteBlog = async id => {
    const toDelete = blogs.find(b => b.id === id)
    if (confirm(`remove blog ${toDelete.title} by ${toDelete.author}`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        notifyWith(`Deleted ${toDelete.name}`)
      } catch (error) {
        notifyWith(error.response.data.error, 'error')
      }
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification notification={notification} />

        {loginForm()}
    </div>
    )
  }

  return (
    <div>
      <h1>blogs</h1>
      <Notification notification={notification} />

      <p>{user.name} logged-in</p><button onClick={handleLogout}>logout</button>

      <h2>create new</h2>
      {blogForm()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog}/>
      )}
    </div>
  )
}

export default App
