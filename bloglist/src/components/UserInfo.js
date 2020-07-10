
import React from 'react'


const userInfo = ({user}) => {

    const blogs = user.blogs
    

    return (
        <div>
            <h1>{user.name}</h1>
            <h2>added blogs</h2>
            <ul>
    {blogs.map(blog => <li key = {blog.id}>{blog.title}</li>)}
            </ul>
        </div>
    )


}

export default userInfo