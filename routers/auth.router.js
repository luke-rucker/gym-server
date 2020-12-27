const Router = require('@koa/router')
const { AuthController } = require('../controllers')
const isAuth = require('../middleware/is-auth')

const auth = new Router()

auth.post('/login', AuthController.login)
auth.delete('/logout', isAuth, AuthController.logout)

module.exports = auth
