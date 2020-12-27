const Router = require('@koa/router')

const auth = require('./auth.router')
const users = require('./user.router')
const members = require('./member.router')
const sessions = require('./session.router')

const isAuth = require('../middleware/is-auth')
const isAdmin = require('../middleware/is-admin')

const router = new Router({ prefix: '/v1' })

router.use('/auth', auth.routes())
router.use('/users', isAuth, isAdmin, users.routes())
router.use('/members', isAuth, members.routes())
router.use('/sessions', isAuth, sessions.routes())

module.exports = router
