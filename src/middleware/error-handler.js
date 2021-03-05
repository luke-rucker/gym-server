function errorHandler(options) {
  const { exposeStack } = options
  return async function (ctx, next) {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = {
        message: ctx.status === 500 ? 'Something went wrong!' : err.message,
        ...(exposeStack ? null : { stack: err.stack }),
      }
      ctx.app.emit('error', err, ctx)
    }
  }
}

module.exports = errorHandler
