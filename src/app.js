const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const errorHandler = require('./middleware/error-handler')
const routes = require('./routes')

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

app.use(routes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
