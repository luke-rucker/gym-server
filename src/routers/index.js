const Router = require('@koa/router')

const router = new Router({ prefix: '/v1' })

router.use('/auth', require('./auth.router'))
router.use('/users', require('./user.router'))
router.use('/members', require('./member.router'))
router.use('/sessions', require('./session.router'))

module.exports = router
