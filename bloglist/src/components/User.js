import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ user }) => {

    /*
    const userStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }
    */

    if (!user) {
        return null
      }

    return (

        <div className = 'user'>
            <Link to={`/users/${user.id}`}>{user.name}</Link><span className='blogslength'>{user.blogs.length}</span>

        </div>
        
    )
}

export default User