const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('@koa/router')
const isAuth = require('./middleware/is-auth')
const errorHandler = require('./middleware/error-handler')

const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
    require('dotenv').config()
    require('./db/seed')()
}

const app = new Koa()

app.use(bodyParser())

app.use(errorHandler({ exposeStack: !isProduction }))

app.on('error', function (err, ctx) {
    if (ctx.status >= 500) {
        console.error(err)
    }
})

// Add /api prefix in environments other than production, where it will be added via a proxy
const router = new Router({
    prefix: process.env.NODE_ENV !== 'production' ? '/api' : '',
})

router.use('/gym', require('./gym'))
router.use('/auth', require('./auth'))
router.use('/users', isAuth(), require('./users'))
router.use('/members', isAuth(), require('./members'))
router.use('/sessions', isAuth(), require('./sessions'))

app.use(router.routes())

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
