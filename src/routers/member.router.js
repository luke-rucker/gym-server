const Router = require('@koa/router')
const { MemberController } = require('../controllers')

const members = new Router()

members.post('/', MemberController.create)
members.get('/', MemberController.getMany)
members.get('/:memberId', MemberController.getById)
members.delete('/:memberId', MemberController.delete)

members.post('/:memberId/sessions', MemberController.createSession)
members.get('/:memberId/sessions', MemberController.getSessions)

module.exports = members.routes()
