const Koa = require('koa')
const koaBody = require('koa-body')
const errorHandler = require('./middleware/error-handler')
const routes = require('./routes')
const { IS_PROD } = require('./constants')

if (!IS_PROD) {
  require('dotenv').config()
  require('./db/seed')()
}

const app = new Koa()

app.use(koaBody({ multipart: true }))

app.use(errorHandler({ exposeStack: !IS_PROD }))

app.on('error', function (err, ctx) {
  if (ctx.status >= 500) {
    console.error(err)
  }
})

app.use(routes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
