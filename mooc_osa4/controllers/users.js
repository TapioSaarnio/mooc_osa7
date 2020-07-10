const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {

    const users = await User.find({}).populate('blogs')
    response.json(users.map(blog => blog.toJSON()))
  
 })


usersRouter.post('/', async (request, response, next) => {

    
    try {
        
    const body = request.body


    if(body.password === undefined || body.password.length < 3){

        response.status(400).send({
            error: 'password must be over 3 characters long'
        })
        return

    }


    
    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(body.password, saltRounds)

    

    const user = new User({

        username: body.username,
        name: body.name,
        passwordHash,

    })

    

    const savedUser = await user.save()

    response.json(savedUser)
} catch (exception) {
        next(exception)    }

})

module.exports = usersRouter