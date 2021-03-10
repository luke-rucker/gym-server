const Router = require('@koa/router')
const { S3 } = require('../util')

const images = new Router()

images.get('/:path*', async function (ctx) {
  const parts = ctx.params.path.split('/')
  const fileName = parts[parts.length - 1]

  const s3 = new S3()
  const file = await s3.downloadFile(ctx.params.path)

  ctx.response.set({
    'Cache-Control': `max-age=${60 * 10}`, // 10 min
    'Content-Disposition': `attachment; filename=${fileName}`,
  })
  ctx.body = file.Body
  ctx.status = 200
})

module.exports = images.routes()
