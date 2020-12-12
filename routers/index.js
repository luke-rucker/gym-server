const Router = require('koa-router')
const { MemberController } = require('../controllers')

const router = new Router({ prefix: '/v1' })

const members = new Router({ prefix: '/members' })

members.post('/', MemberController.create)
members.get('/', MemberController.getMany)
members.get('/:id', MemberController.getById)
members.delete('/:id', MemberController.delete)

router.use(members.routes(), members.allowedMethods())

module.exports = router
