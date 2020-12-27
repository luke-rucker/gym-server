const Router = require('@koa/router')
const { UserController } = require('../controllers')

const users = new Router()

users.post('/', UserController.create)
users.get('/', UserController.getMany)
users.delete('/:id', UserController.delete)

module.exports = users
