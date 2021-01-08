const Router = require('@koa/router')
const { UserController } = require('../controllers')
const isAdmin = require('../middleware/is-admin')

const users = new Router()

users.post('/', isAdmin(), UserController.create)
users.get('/me', UserController.me)
users.get('/', isAdmin(), UserController.getMany)
users.delete('/:id', isAdmin(), UserController.delete)

module.exports = users.routes()
