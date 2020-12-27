function errorHandler(options) {
    const { exposeStack } = options
    return async function (ctx, next) {
        try {
            await next()
        } catch (err) {
            ctx.status = err.status || 500
            ctx.body = {
                message: err.message || 'Something went wrong!',
                ...(exposeStack ? null : { stack: err.stack }),
            }
            ctx.app.emit('error', err, ctx)
        }
    }
}

module.exports = errorHandler
