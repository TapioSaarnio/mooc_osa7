import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import User from './components/User'
import Userinfo from './components/UserInfo'
import BlogInfo from './components/BlogInfo'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import { useSelector, useDispatch} from 'react-redux'
import { setNotificationCreate } from './reducers/notificationReducer'
import { setNotificationFailedLogin } from './reducers/notificationReducer'
import { setBlogs } from './reducers/blogsReducer'
import { setUser } from './reducers/userReducer'
import { setUsers } from './reducers/usersReducer'
import { addBlog } from './reducers/blogsReducer'
import { Table } from 'react-bootstrap'

import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom"


const App = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [createVisible, setCreateVisible] = useState(false)
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)

  const matchU = useRouteMatch('/users/:id')
  const matchB = useRouteMatch('/blogs/:id')

  const userMatch = matchU 
                 ? users.find(userFind => userFind.id === matchU.params.id)
                : null

  const blogMatch = matchB
                 ? blogs.find(b => b.id === matchB.params.id)
                 : null

  
  const createBlog = (blogObject) => {

    dispatch(addBlog(blogObject))
    dispatch(setNotificationCreate(`A new blog ${blogObject.title} by ${blogObject.author} added`, 5))
    
  }

  useEffect(() => {

     dispatch(setBlogs())
     dispatch(setUsers())

  }, [dispatch])

  useEffect(() => {

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))

      setUsername('')
      setPassword('')
    } catch(excpetion) {

      dispatch(setNotificationFailedLogin(5))
    }
  }

  const handleLogOut = async () => {

    console.log('handleLogOut')
    window.localStorage.clear()
    dispatch(setUser(null))
  }

  const loginForm = () => (
    <li id='loginForm'>
    <form onSubmit={handleLogin}>
      <div id='loginform'>
        <span id='usernameSpan'>username</span>
        <input
          type="text"
          value={username}
          id='username'
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <span id='passwordSpan'>password</span>
        <input
          type="password"
          id='password'
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login' type="submit">login</button>
    </form>
    </li>
  )

  const blogForm = () => {

    const hideWhenVisible = { display: createVisible ? 'none' : '' }
    const showWhenVisible = { display: createVisible ? '' : 'none' }

    return(
      <div>
        <div style={hideWhenVisible}>
          <button id='createNew' onClick={() => setCreateVisible(true)}>Create New</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            createBlog={createBlog}/>
          <button onClick={() => setCreateVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }


  return (
    <div >
      <div>
          <div className='topnav'>
        <ul id = 'navbar'>
          <li className='navli'><a href='/'>blogs</a></li>
          <li className='navli'><a href='/users'>users</a></li>
          {user === null ?
        loginForm() :
        <div>
          <li id='loggedin'>
          <p id='loggedinP'>{user.name} logged in</p> <button id='logOut' type="button" onClick={handleLogOut}>logout</button>
          </li>
        </div>
      }
        </ul>
        </div>
      <div>
      {user === null ? null : blogForm()}
        </div>
        </div>
      <Notification message={notification} />
       <Switch>
      <Route path="/users/:id">
      <Userinfo user={userMatch}/>
      </Route>
      <Route path="/blogs/:id">
        <BlogInfo blog = {blogMatch} user={user} />
      </Route>
      <Route exact path="/">
      <h2><div name="blogs">Blogs</div></h2>
      <Table striped>
        <tbody>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user = {user}/>
      )}
      </tbody>
      </Table>
      </Route>
      <Route path="/users">
        <h2>Users</h2>
        <strong id="blogscreated">blogs created</strong>
        {users.map(user => <User key = {user.id} user = {user}/>)}
      </Route>
      </Switch>
    </div>
  )
}

export default App