const Router = require('@koa/router')
const { S3 } = require('../util')

const images = new Router()

images.get('/:path*', async function (ctx) {
  const parts = ctx.params.path.split('/')
  const fileName = parts[parts.length - 1]

  try {
    const s3 = new S3()
    const file = await s3.downloadFile(ctx.params.path)

    ctx.response.set({
      'Cache-Control': `max-age=${60 * 60 * 24}`, // 1 day
      'Content-Disposition': `attachment; filename=${fileName}`,
    })
    ctx.body = file.Body
    ctx.status = 200
  } catch (error) {
    if (error.$metadata.httpStatusCode === 404) {
      ctx.throw(404, 'Image does not exist.')
    } else {
      throw error
    }
  }
})

module.exports = images.routes()
