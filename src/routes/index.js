const Router = require('@koa/router')
const { IS_PROD } = require('../constants')
const isAuth = require('../middleware/is-auth')

// Add /api prefix in environments other than production, where it will be added via a proxy
const router = new Router({
  prefix: !IS_PROD ? '/api' : '',
})

router.use('/gym', require('./gym'))
router.use('/auth', require('./auth'))
router.use('/users', isAuth(), require('./users'))
router.use('/members', isAuth(), require('./members'))
router.use('/sessions', isAuth(), require('./sessions'))

module.exports = router.routes()
