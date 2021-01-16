const Router = require('@koa/router')
const isAuth = require('../middleware/is-auth')

// Add /api prefix in environments other than production, where it will be added via a proxy
const router = new Router({
    prefix: process.env.NODE_ENV !== 'production' ? '/api' : '',
})

router.use('/gym', require('./gym.router'))
router.use('/auth', require('./auth.router'))
router.use('/users', isAuth(), require('./user.router'))
router.use('/members', isAuth(), require('./member.router'))
router.use('/sessions', isAuth(), require('./session.router'))

module.exports = router
