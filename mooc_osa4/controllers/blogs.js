const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {

     const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
     response.json(blogs.map(blog => blog.toJSON()))
   
  })

  /*
  const getTokenFrom = request => {

    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')){
      return authorization.substring(7)
    }

    return null

  }
  */
  
  blogsRouter.post('/', async (request, response) => {

    const body = request.body
    console.log('createbody')
    console.log(body)
    //const token = getTokenFrom(request)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {

      return response.status(401).json({error: 'token missing or invalid' })

    }

  
    const user1 = await User.findById(decodedToken.id)

    //console.log(user1)


    const blog = new Blog({

      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      comments: body.comments,
      user: user1._id
      
    })

    if(blog.title === undefined || blog.url === undefined){

      response.status(400).end()
      return

    }
  
    const savedBlog = await blog.save()
    const savedBlogPop = await savedBlog.populate('user', {username: 1, name: 1, id: 1}).execPopulate()
    user1.blogs = user1.blogs.concat(savedBlogPop._id)
    await user1.save()

    response.json(savedBlog.toJSON())
  })

  blogsRouter.put('/:id', (request, response, next) => {


    const body = request.body
   
     const blog = {
       title: body.title,
       author: body.author,
       url: body.url,
       likes: body.likes,
       
     }

     Blog.findByIdAndUpdate(request.params.id, blog, { new: true})
         .then(updatedBlog => {
           response.json(updatedBlog.toJSON())
         })
         .catch(error => next(error))

  })

  blogsRouter.post('/:id/comments', (request, response, next) => {


    const body = request.body
   
     const blog = {
       title: body.title,
       author: body.author,
       url: body.url,
       likes: body.likes,
       comments: body.comments
       
     }
   

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true})
         .then(updatedBlog => {
           response.json(updatedBlog.toJSON())
         })
         .catch(error => next(error))
   
  }
  )

  blogsRouter.delete('/:id', async (request, response) => {

    const body = request.body

    if(request.token === undefined){

      response.status(401).end()
      return

    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const blog = await Blog.findById(request.params.id)

    if(decodedToken.id === blog.user.toString()){

      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
      return

    }

    if(decodedToken.id){

      response.status(403).end()
      return
    }
    
  })

  module.exports = blogsRouter
  
