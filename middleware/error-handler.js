function errorHandler(options) {
    const { exposeStack } = options
    return async function (ctx, next) {
        try {
            await next()
        } catch (err) {
            const body = {
                message: err.message || 'Something went wrong!',
            }
            if (exposeStack) {
                body.stack = err.stack
            }
            ctx.status = err.status || 500
            ctx.body = body
            ctx.app.emit('error', err, ctx)
        }
    }
}

module.exports = errorHandler
