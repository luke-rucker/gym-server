const Router = require('@koa/router')
const isAuth = require('../middleware/is-auth')

const router = new Router()

router.use('/auth', require('./auth.router'))
router.use('/users', isAuth(), require('./user.router'))
router.use('/members', isAuth(), require('./member.router'))
router.use('/sessions', isAuth(), require('./session.router'))

module.exports = router
