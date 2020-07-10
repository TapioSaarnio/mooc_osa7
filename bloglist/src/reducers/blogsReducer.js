import blogService from '../services/blogs'


const reducer = (state=[], action) => {

    switch (action.type) {

        case 'SET_BLOGS':

            return action.data

        case 'ADD_BLOG': 

           return state.concat(action.data)

        case 'LIKE_BLOG':

        const id = action.data
        const blogToLike = state.find(n => n.id === id)
        const likedBlog = {
            ...blogToLike,
            likes: blogToLike.likes 
        }

        const state2 = state.map(b => 
            b.id !== id ? b : likedBlog)
      
           return state2.sort((a, b) => b.likes - a.likes)

        case 'COMMENT_BLOG':

        const id2 = action.data
        const blogToComment = state.find(n => n.id === id2)
        const commentedBlog = {
            ...blogToComment,
            comments: blogToComment.comments
        }
        const state3 = state.map(b => 
            b.id !== id2 ? b : commentedBlog)
      
           return state3.sort((a, b) => b.likes - a.likes)

        case 'DELETE_BLOG':

        const id3 = action.data
           const state4 = state.filter(b => b.id !== id3)
           return state4.sort((a, b) => b.likes - a.likes)


        default: return state
    }

}

export const addBlog = (createdBlog) => {

    return async dispatch => {
        const newBlog = await blogService.create(createdBlog)
        dispatch({
            type: 'ADD_BLOG',
            data: newBlog
        })
    }
}

export const likeBlog = (blog) => {

    
    return async dispatch => {
        const likedBlog = await blogService.update(blog.id, blog)
        dispatch({
            type: 'LIKE_BLOG',
            data: likedBlog.id
        })

    }
}

export const commentBlog = (blog) => {

    return async dispatch => {
        
        const commentedBlog = await blogService.comment(blog)

        dispatch({
            type: 'COMMENT_BLOG',
            data: commentedBlog.id

        })
    }
}

export const deleteBlog = (id) => {


    return async dispatch => {

        await blogService.del(id)

        dispatch({
            type: 'DELETE_BLOG',
            data: id

        }
        )
    }
}


export const setBlogs = () => {

    return async dispatch => {
        let blogsToSet = await blogService.getAll()
        blogsToSet.sort((a, b) => b.likes - a.likes)
        dispatch({
            type: 'SET_BLOGS',
            data: blogsToSet
        })
    }
}

export default reducer