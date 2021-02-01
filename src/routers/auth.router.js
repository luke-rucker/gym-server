const Router = require('@koa/router')
const { AuthController } = require('../controllers')

const auth = new Router()

auth.post('/login', AuthController.login)

module.exports = auth.routes()
