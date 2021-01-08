const Router = require('@koa/router')
const { SessionController } = require('../controllers')

const sessions = new Router()

sessions.get('/', SessionController.getMany)
sessions.delete('/:id', SessionController.delete)
sessions.patch('/:id/finish', SessionController.finish)

module.exports = sessions.routes()
