const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./routers')
const errorHandler = require('./middleware/error-handler')

const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
    require('dotenv').config()
    require('./db/seed')()
}

const app = new Koa()

app.use(bodyParser())

app.use(errorHandler({ exposeStack: !isProduction }))

app.use(router.routes()).use(router.allowedMethods())

app.on('error', function (err, ctx) {
    if (ctx.status >= 500) {
        console.error(err)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
