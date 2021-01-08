function isAdmin() {
    return async function (ctx, next) {
        const { role } = ctx.state.user
        if (role !== 'ADMIN') {
            ctx.throw(403, 'Invalid permissions.')
        }
        await next()
    }
}

module.exports = isAdmin
