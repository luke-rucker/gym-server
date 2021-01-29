const Router = require('@koa/router')
const { SessionController } = require('../controllers')

const sessions = new Router()

sessions.get('/', SessionController.getMany)
sessions.delete('/:sessionId', SessionController.delete)
sessions.patch('/:sessionId/finish', SessionController.finish)

module.exports = sessions.routes()
