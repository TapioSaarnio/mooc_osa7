const logger = require('./logger')

const requestlogger = (request, response, next) => {

    logger.info(request.method)
    logger.info(request.path)
    logger.info(request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {

    response.status(404).send({error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {

    logger.error(error.message)

    if(error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name ==='ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {

    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')){
      const token=authorization.substring(7)
      request.token = token
      
    }

    next()

  }

module.exports = {

    requestlogger,
    unknownEndpoint,
    tokenExtractor,
    errorHandler
}