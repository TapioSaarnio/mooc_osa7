import React, { useState } from 'react'
import { likeBlog } from '../reducers/blogsReducer'
import { commentBlog } from '../reducers/blogsReducer'
import { deleteBlog } from '../reducers/blogsReducer'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setNotificationRemove } from '../reducers/notificationReducer'

const BlogInfo = ({ blog, user }) => {

    const [comment, setComment] = useState('')
    const dispatch = useDispatch()
    const history = useHistory()

    

    const handleLike = (blogObject) => {

        blogObject.blog.likes = blogObject.blog.likes + 1

        dispatch(likeBlog(blogObject.blog))


      }

    const handleRemove = ( blogPar ) => {

 
        const message = `Blog ${blogPar.blog.title} by ${blogPar.blog.author} was removed`

        dispatch(deleteBlog(blogPar.blog.id))
        history.push('/')
        dispatch(setNotificationRemove(message, 5))
  
    }

    const handleComment = ( blogObject, {comment} ) => {

        console.log('handlecomment')

        blogObject.blog.comments = blogObject.blog.comments.concat(comment)
        dispatch(commentBlog(blogObject.blog))
        
      
        setComment('')
        
    }

    //console.log(blog)
    //console.log(user)

    

    
    if(user && blog.user.username === user.username){

        return(
            <div>
                <h2>{blog.title}</h2>
                 <p>{blog.url}</p>
                <span>{blog.likes}</span> <button onClick = {() => handleLike({blog})}>like</button>
                <p>added by {blog.author}</p>
                <button onClick = { () => handleRemove({blog})}>remove</button>
                <h2>comments</h2>
                <ul>
        {blog.comments.map(comment => <li key={comment}>{comment}</li>)}
                </ul>
                    <input type="text"
                    value={comment}
                    id='comment'
                    onChange={({ target }) => setComment(target.value)}/>
                    <button onClick = {() => handleComment({blog}, {comment})}>add comment</button>
                </div>
        )
    }

    return(
        <div>
            <h2>{blog.title}</h2>
             <p>{blog.url}</p>
            <span>{blog.likes}</span> <button onClick = {() => handleLike({blog})}>like</button>
            <p>added by {blog.author}</p>
            <h2>comments</h2>
            <ul>
    {blog.comments.map(comment => <li key={comment}>{comment}</li>)}
            </ul>
                <input type="text"
                value={comment}
                id='comment'
                onChange={({ target }) => setComment(target.value)}/>
                <button onClick = {() => handleComment({blog}, {comment})}>add comment</button>
            </div>
    )
}

export default BlogInfo