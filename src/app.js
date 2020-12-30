const Koa = require('koa')
const session = require('koa-session')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const router = require('./routers')
const errorHandler = require('./middleware/error-handler')

const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
    require('dotenv').config()
    require('./db/seed')()
}

// App config
const app = new Koa()

// Session middleware
app.keys = [process.env.SESSION_SECRET]

app.use(
    session(
        {
            key: 'sess',
            maxAge: parseInt(process.env.SESSION_MAX_AGE),
            httpOnly: true,
            signed: true,
            secure: isProduction,
            sameSite: true,
        },
        app
    )
)

// Enable cors
app.use(cors())

// Json parsing middleware
app.use(bodyParser())

// Error handling middleware
app.use(errorHandler({ exposeStack: !isProduction }))

// Mount routes
app.use(router.routes()).use(router.allowedMethods())

// Centralized error logging
app.on('error', function (err, ctx) {
    console.error(err)
})

// Configure port and start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
