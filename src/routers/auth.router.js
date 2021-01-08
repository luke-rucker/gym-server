const Router = require('@koa/router')
const { AuthController } = require('../controllers')

const auth = new Router()

auth.post('/login', AuthController.login)
auth.post('/token/refresh', AuthController.refreshToken)
auth.delete('/token/invalidate', AuthController.invalidateToken)

module.exports = auth.routes()
