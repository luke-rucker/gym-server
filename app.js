require('dotenv').config()
const Koa = require('koa')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const router = require('./routers')

// App config
const app = new Koa()

// Enable cors
app.use(cors())

// Json parsing middleware
app.use(bodyParser())

// Error handling middleware
app.use(async function (ctx, next) {
    try {
        await next()
    } catch (err) {
        ctx.status = err.status || 500
        ctx.body = {
            message: err.message || 'something went wrong!',
        }
        ctx.app.emit('error', err, ctx)
    }
})

// Mount routes
app.use(router.routes()).use(router.allowedMethods())

// Centralized error logging
app.on('error', function (err, ctx) {
    console.error(err)
})

process.on('unhandledRejection', function (reason) {
    console.error(reason)
    process.exit(1)
})

// Configure port and start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`listening on ${PORT}`))
