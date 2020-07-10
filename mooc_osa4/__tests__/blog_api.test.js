const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'fitness blog',
        author: 'Stacy',
        url:'www.fitnessblog.com',
        likes: 30
    },
    {
        title: 'surf blog',
        author: 'Dude',
        url:'www.surfblog.com',
        likes: 14

    }
]

beforeEach(async () => {

    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})


test('blogs are returned as json', async () => {
 
    await api
       .get('/api/blogs')
       .expect(200)
       .expect('Content-Type', /application\/json/)
    
})

test('the correct amount of blogs are returned', async () => {

    const response = await api.get('/api/blogs')


    expect(response.body).toHaveLength(2)
})

test('blog is identifiable by id', async () => {

    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()

})

test('adding a blog is working', async () => {

    let addBlog = new Blog({
        "title": "tapsan blogi",
        "author":"tapsa",
        "url":"www.tapsa.com",
        "likes": "666"
    })

    await api.post('/api/blogs').send(addBlog)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(3)

})

test('if likes is not defined the value will be zero', async () => {

    const initialBlogs2 = [
        {
            title: 'fitness blog',
            author: 'Stacy',
            url:'www.fitnessblog.com'
            
        },
        {
            title: 'surf blog',
            author: 'Dude',
            url:'www.surfblog.com'
            
    
        }
    ]

    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs2[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs2[1])
    await blogObject.save()


    const response = await api.get('/api/blogs')
    expect(response.body[0].likes).toBe(0)


})

test('if title or url is not defined response will be 400', async () => {

    
    await Blog.deleteMany({})

    const newBlog = {
        author: 'somebody',
        likes: 1
    }

    await api.post('/api/blogs')
           .send(newBlog)
           .expect(400)
    

})

test('does updating a blog work', async () => {

    const blog = new Blog({

        title: 'fitness blog',
        author: 'Stacy',
        url:'www.fitnessblog.com',
        likes: 301

    })

    let firstBlog = await api.get('/api/blogs')
    firstBlog = firstBlog.body[0]

    const response = await api.put('/api/blogs/' + firstBlog.id).send(blog)
    expect(response.body.likes).toBe(301)
})


afterAll(() => {
    mongoose.connection.close()
})