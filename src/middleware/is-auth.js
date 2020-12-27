async function isAuth(ctx, next) {
    if (!ctx.session.user) {
        ctx.throw(401, 'Unauthorized.')
    }
    await next()
}

module.exports = isAuth
