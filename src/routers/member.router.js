const Router = require('@koa/router')
const { MemberController } = require('../controllers')
const isAuth = require('../middleware/is-auth')

const members = new Router()

members.use(isAuth())

members.post('/', MemberController.create)
members.get('/', MemberController.getMany)
members.get('/:id', MemberController.getById)
members.delete('/:id', MemberController.delete)

members.post('/:id/sessions', MemberController.createSession)
members.get('/:id/sessions', MemberController.getSessions)

module.exports = members.routes()
