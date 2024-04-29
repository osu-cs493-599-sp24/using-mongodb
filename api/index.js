const { Router } = require('express')

const lodgingsRouter = require('./lodgings')
const reservationsRouter = require('./reservations')

const apiRouter = Router()

apiRouter.use('/lodgings', lodgingsRouter)
apiRouter.use('/reservations', reservationsRouter)

module.exports = apiRouter
