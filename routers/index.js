const Router = require('koa-router')
const { MemberController, SessionController } = require('../controllers')

const router = new Router({ prefix: '/v1' })

const members = new Router({ prefix: '/members' })
members.post('/', MemberController.create)
members.get('/', MemberController.getMany)
members.get('/:id', MemberController.getById)
members.delete('/:id', MemberController.delete)
members.post('/:id/sessions', MemberController.createSession)
members.get('/:id/sessions', MemberController.getSessions)
router.use(members.routes(), members.allowedMethods())

const sessions = new Router({ prefix: '/sessions' })
sessions.get('/', SessionController.getMany)
sessions.delete('/:id', SessionController.delete)
router.use(sessions.routes(), sessions.allowedMethods())

module.exports = router
